import { DATASET_REGISTRY as RAW_REGISTRY, allDatasets as RAW_ALL_DATASETS } from '../data/datasetsRegistry';

export const getComputeRate = (category) => {
    const cat = String(category).toUpperCase();
    if (cat.includes('MENTAL') || cat.includes('PSYCH')) return 1;
    if (cat.includes('EHR') || cat.includes('ICU') || cat.includes('CLINICAL')) return 2;
    if (cat.includes('TRIAL') || cat.includes('REAL-WORLD') || cat.includes('PHARMA') || cat.includes('SURVEILLANCE')) return 3;
    if (cat.includes('IMAGING') || cat.includes('RADIOLOGY') || cat.includes('DICOM')) return 5;
    if (cat.includes('GENOM')) return 8;
    return 2; // default fallback
};

export const getAnnualLicenseCredits = (price) => {
    if (typeof price === 'number') {
        return Math.round(price / 10);
    }
    if (typeof price === 'string') {
        const num = parseInt(price.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) return Math.round(num / 10);
    }
    return 1500; // default fallback credits
};

// Processed Dataset Registry
export const DATASET_REGISTRY = {};
Object.keys(RAW_REGISTRY).forEach(key => {
    const ds = RAW_REGISTRY[key];
    const price = ds.price || 15000;
    DATASET_REGISTRY[key] = {
        ...ds,
        computeCreditRate: getComputeRate(ds.category),
        annualLicenseCredits: getAnnualLicenseCredits(price),
        price: getAnnualLicenseCredits(price) // Override price with credits
    };
});

// Processed Array of All Datasets
export const allDatasets = RAW_ALL_DATASETS.map(ds => {
    const price = ds.price || ds.startingPrice || 15000;
    const credits = getAnnualLicenseCredits(price);
    return {
        ...ds,
        computeCreditRate: getComputeRate(ds.category),
        annualLicenseCredits: credits,
        price: credits, // Override price with credits
        startingPrice: credits // Override startingPrice with credits
    };
});
