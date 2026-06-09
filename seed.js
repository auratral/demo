import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { allDatasets as RAW_ALL_DATASETS } from "./src/data/datasetsRegistry.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtg-pdR-bANTC-uLT4JdUrgufum4GnQrQ",
  authDomain: "auratral-mvp.firebaseapp.com",
  projectId: "auratral-mvp",
  storageBucket: "auratral-mvp.firebasestorage.app",
  messagingSenderId: "557804669925",
  appId: "1:557804669925:web:3fbf43561544d4c9ac3d0c",
  measurementId: "G-0HCT1Y8JN2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default");

const getComputeRate = (category) => {
    const cat = String(category).toUpperCase();
    if (cat.includes('MENTAL') || cat.includes('PSYCH')) return 1;
    if (cat.includes('EHR') || cat.includes('ICU') || cat.includes('CLINICAL')) return 2;
    if (cat.includes('TRIAL') || cat.includes('REAL-WORLD') || cat.includes('PHARMA') || cat.includes('SURVEILLANCE')) return 3;
    if (cat.includes('IMAGING') || cat.includes('RADIOLOGY') || cat.includes('DICOM')) return 5;
    if (cat.includes('GENOM')) return 8;
    return 2;
};

const getAnnualLicenseCredits = (price) => {
    if (typeof price === 'number') {
        return Math.round(price / 10);
    }
    if (typeof price === 'string') {
        const num = parseInt(price.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) return Math.round(num / 10);
    }
    return 1500;
};

const allDatasets = RAW_ALL_DATASETS.map(ds => {
    const price = ds.price || ds.startingPrice || 15000;
    const credits = getAnnualLicenseCredits(price);
    return {
        ...ds,
        computeCreditRate: getComputeRate(ds.category),
        annualLicenseCredits: credits,
        price: credits,
        startingPrice: credits
    };
});

async function seed() {
  console.log("Starting seeding of datasets into Firestore...");
  console.log(`Found ${allDatasets.length} datasets to upload.`);

  for (const ds of allDatasets) {
    try {
      const cleanDs = JSON.parse(JSON.stringify(ds));
      const docRef = doc(db, "datasets", ds.id);
      await setDoc(docRef, cleanDs);
      console.log(`Successfully uploaded dataset: ${ds.id} (${ds.name})`);
    } catch (err) {
      console.error(`Failed to upload dataset ${ds.id}:`, err);
    }
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed();
