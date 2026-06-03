import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { DATASET_REGISTRY } from '../data/datasetsRegistry';

/**
 * Checks if the 'datasets' collection is empty and seeds it if necessary.
 * Seeds all 60 programmatically generated datasets.
 * Runs in the background and is non-blocking.
 * @param {import('firebase/firestore').Firestore} db 
 */
export const seedDatasetsIfEmpty = async (db) => {
    try {
        const datasetsColRef = collection(db, 'datasets');
        const snapshot = await getDocs(datasetsColRef);
        
        if (snapshot.empty) {
            console.log("Firestore 'datasets' collection is empty. Initiating automatic seeding of 60 clinical datasets...");
            
            const datasetKeys = Object.keys(DATASET_REGISTRY);
            
            // We seed using batches of 20 to avoid exceeding Firestore's 500-write batch limit
            const batchSize = 20;
            for (let i = 0; i < datasetKeys.length; i += batchSize) {
                const batch = writeBatch(db);
                const chunk = datasetKeys.slice(i, i + batchSize);
                
                chunk.forEach(key => {
                    const datasetDocRef = doc(db, 'datasets', key);
                    batch.set(datasetDocRef, DATASET_REGISTRY[key]);
                });
                
                await batch.commit();
                console.log(`Seeded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(datasetKeys.length / batchSize)}...`);
            }
            
            console.log("Successfully seeded 60 datasets to Firestore!");
        } else {
            console.log(`Firestore 'datasets' collection already populated with ${snapshot.size} records. Skipping seeding.`);
        }
    } catch (error) {
        console.error("Error during Firestore datasets seeding: ", error);
    }
};
