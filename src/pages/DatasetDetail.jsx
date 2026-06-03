import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Star, ShieldCheck, Download, Code2, Box, ArrowLeft, CheckCircle2,
    Table, BarChart2, Info, Eye, Database, Users, X, Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   PER-DATASET MOCK DATA REGISTRY
   Each key = dataset id from Gallery.jsx
═══════════════════════════════════════════════════════════════ */
const DATASET_REGISTRY = {

    'AUR-EHR-00087': {
        meta: {
            name: 'Longitudinal ICU Encounters – Critical Care Dataset',
            source: 'Multi-site Academic Medical Center Network',
            category: 'EHR', subCategory: 'ICU & Critical Care',
            rating: 4.9, reviews: 124, records: '186,000', variables: 247,
            formats: ['CSV', 'Parquet', 'JSON', 'FHIR R4'],
            compliance: ['HIPAA Safe Harbor', 'GDPR Article 9 Ready', 'DPDP Compliant'],
            updateFrequency: 'Annually Refreshed', price: 12367,
            doi: '10.5281/auratral.ehr.87920',
            temporalCoverage: '2008 – 2023', completenessScore: 97.8, qualityScore: 92,
            description: `A comprehensive, de-identified longitudinal dataset of ICU encounters covering vital signs, labs, medications, and clinical notes across a decade.\n\nDesigned for sepsis onset prediction, mortality risk models, length-of-stay estimation, and health economics analysis.`,
        },
        defaultCohort: {
            records: '125,847', gender: 'Balanced — 51% Male / 49% Female',
            ageRange: '18 – 90 years', region: 'Pan-India (all states & UTs)',
            timePeriod: '2008 – 2023',
            conditions: 'All ICU admission types (medical, surgical, trauma)',
            exclusions: 'Paediatric (<18 yr), incomplete records (<24 h stay)',
            format: 'CSV',
        },
        columns: [
            { name: 'age', dtype: 'Int32', description: 'Patient age in years at ICU admission', units: 'Years', nulls: 0, example: '67', histogram: [2, 5, 12, 22, 34, 42, 38, 28, 14, 3] },
            { name: 'gender', dtype: 'String', description: 'Biological sex (M / F / Other)', units: '—', nulls: 0, example: 'M', histogram: null },
            { name: 'sofa_score', dtype: 'Float32', description: 'Sequential Organ Failure Assessment score (0–24)', units: 'Score', nulls: 214, example: '8.5', histogram: [18, 30, 42, 54, 46, 38, 28, 16, 8, 4] },
            { name: 'heart_rate', dtype: 'Float32', description: 'Mean heart rate during first 24 h', units: 'bpm', nulls: 0, example: '94.2', histogram: [3, 10, 22, 40, 55, 48, 32, 16, 6, 2] },
            { name: 'sbp', dtype: 'Float32', description: 'Mean systolic blood pressure first 24 h', units: 'mmHg', nulls: 0, example: '118.4', histogram: [4, 12, 28, 46, 52, 44, 30, 14, 6, 2] },
            { name: 'spo2', dtype: 'Float32', description: 'Mean peripheral O₂ saturation first 24 h', units: '%', nulls: 312, example: '97.1', histogram: [1, 2, 4, 8, 14, 24, 48, 52, 30, 15] },
            { name: 'lactate', dtype: 'Float32', description: 'Serum lactate on admission', units: 'mmol/L', nulls: 1420, example: '2.3', histogram: [28, 40, 30, 20, 14, 10, 8, 5, 3, 2] },
            { name: 'icu_los', dtype: 'Float32', description: 'ICU length of stay in days', units: 'Days', nulls: 0, example: '4.7', histogram: [48, 32, 22, 16, 10, 7, 5, 3, 2, 1] },
            { name: 'primary_diagnosis', dtype: 'String', description: 'ICD-10 primary admission diagnosis code', units: '—', nulls: 0, example: 'J18.9', histogram: null },
            { name: 'mortality_28d', dtype: 'Boolean', description: '28-day all-cause in-hospital mortality flag', units: '—', nulls: 0, example: 'false', histogram: [82, 18] },
        ],
        rows: [
            { age: 67, gender: 'M', sofa_score: 8.5, heart_rate: 94.2, sbp: 118.4, spo2: 97.1, lactate: 2.3, icu_los: 4.7, primary_diagnosis: 'A41.9', mortality_28d: 'false' },
            { age: 53, gender: 'F', sofa_score: 4.0, heart_rate: 88.6, sbp: 127.2, spo2: 98.4, lactate: 1.1, icu_los: 2.1, primary_diagnosis: 'J18.9', mortality_28d: 'false' },
            { age: 74, gender: 'M', sofa_score: 12.0, heart_rate: 108.3, sbp: 96.8, spo2: 93.6, lactate: 4.7, icu_los: 11.2, primary_diagnosis: 'I46.9', mortality_28d: 'true' },
            { age: 41, gender: 'F', sofa_score: null, heart_rate: 76.1, sbp: 135.6, spo2: 99.0, lactate: 0.8, icu_los: 1.3, primary_diagnosis: 'K85.9', mortality_28d: 'false' },
            { age: 82, gender: 'M', sofa_score: 16.5, heart_rate: 121.0, sbp: 82.3, spo2: null, lactate: 7.2, icu_los: 18.9, primary_diagnosis: 'N17.9', mortality_28d: 'true' },
        ],
    },

    'AUR-IMG-00143': {
        meta: {
            name: 'High-Res Chest X-Ray Annotations',
            source: 'Consortium of Radiology Teaching Hospitals',
            category: 'Imaging', subCategory: 'Thoracic Radiology',
            rating: 4.8, reviews: 89, records: '45,200', variables: 18,
            formats: ['DICOM', 'JSON'],
            compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'],
            updateFrequency: 'Bi-annually', price: 24817,
            doi: '10.5281/auratral.img.14389',
            temporalCoverage: '2015 – 2024', completenessScore: 99.1, qualityScore: 95,
            description: `Expert radiologist-annotated chest X-ray images covering 14 pathological findings. Includes bounding-box coordinates, confidence scores, and clinical metadata.\n\nOptimised for pneumonia detection, nodule localisation, and triage automation models.`,
        },
        defaultCohort: {
            records: '45,230', gender: 'Natural distribution — 62% Male / 38% Female',
            ageRange: '15 – 90 years', region: 'Pan-India (radiology teaching hospitals)',
            timePeriod: '2015 – 2024',
            conditions: '14 pathological finding classes + No Finding',
            exclusions: 'Paediatric lateral views, duplicate studies',
            format: 'DICOM + JSON',
        },
        columns: [
            { name: 'image_id', dtype: 'String', description: 'Unique hash identifier for the DICOM image', units: '—', nulls: 0, example: 'IMG-00143-0021A', histogram: null },
            { name: 'view_position', dtype: 'String', description: 'X-ray projection: PA or AP', units: '—', nulls: 0, example: 'PA', histogram: null },
            { name: 'age_at_scan', dtype: 'Int32', description: 'Patient age at time of imaging', units: 'Years', nulls: 0, example: '58', histogram: [2, 7, 14, 22, 30, 36, 28, 18, 9, 3] },
            { name: 'gender', dtype: 'String', description: 'Biological sex (M / F)', units: '—', nulls: 0, example: 'F', histogram: null },
            { name: 'image_width_px', dtype: 'Int32', description: 'Pixel width of the DICOM image', units: 'px', nulls: 0, example: '2048', histogram: [4, 8, 14, 28, 50, 48, 36, 12, 4, 2] },
            { name: 'finding_label', dtype: 'String', description: 'Primary radiologist finding label (14 classes + No Finding)', units: '—', nulls: 0, example: 'Pneumonia', histogram: null },
            { name: 'finding_confidence', dtype: 'Float32', description: 'Radiologist confidence score (0–1)', units: 'Score', nulls: 0, example: '0.92', histogram: [2, 4, 8, 10, 12, 18, 24, 30, 22, 10] },
            { name: 'bbox_x', dtype: 'Int32', description: 'Bounding box top-left X coordinate', units: 'px', nulls: 2140, example: '312', histogram: [18, 22, 28, 30, 26, 22, 18, 14, 10, 6] },
            { name: 'bbox_y', dtype: 'Int32', description: 'Bounding box top-left Y coordinate', units: 'px', nulls: 2140, example: '215', histogram: [16, 20, 26, 32, 28, 24, 20, 16, 12, 6] },
            { name: 'annotator_id', dtype: 'String', description: 'De-identified annotating radiologist identifier', units: '—', nulls: 0, example: 'RAD-07', histogram: null },
        ],
        rows: [
            { image_id: 'IMG-00143-0021A', view_position: 'PA', age_at_scan: 58, gender: 'F', image_width_px: 2048, finding_label: 'Pneumonia', finding_confidence: 0.92, bbox_x: 312, bbox_y: 215, annotator_id: 'RAD-07' },
            { image_id: 'IMG-00143-0082C', view_position: 'AP', age_at_scan: 43, gender: 'M', image_width_px: 1792, finding_label: 'No Finding', finding_confidence: 0.97, bbox_x: null, bbox_y: null, annotator_id: 'RAD-02' },
            { image_id: 'IMG-00143-0119F', view_position: 'PA', age_at_scan: 71, gender: 'M', image_width_px: 2048, finding_label: 'Cardiomegaly', finding_confidence: 0.88, bbox_x: 480, bbox_y: 390, annotator_id: 'RAD-11' },
            { image_id: 'IMG-00143-0204B', view_position: 'PA', age_at_scan: 29, gender: 'F', image_width_px: 2560, finding_label: 'Pleural Effusion', finding_confidence: 0.81, bbox_x: 198, bbox_y: 540, annotator_id: 'RAD-07' },
            { image_id: 'IMG-00143-0317E', view_position: 'AP', age_at_scan: 65, gender: 'M', image_width_px: 1792, finding_label: 'Atelectasis', finding_confidence: 0.74, bbox_x: 620, bbox_y: 310, annotator_id: 'RAD-03' },
        ],
    },

    'AUR-PVM-00021': {
        meta: {
            name: 'FDA FAERS Curated Extract',
            source: 'FDA Adverse Event Reporting System (Public Domain Extract)',
            category: 'Pharma', subCategory: 'Pharmacovigilance',
            rating: 4.7, reviews: 61, records: '2,400,000', variables: 34,
            formats: ['CSV', 'SQL'],
            compliance: ['Aggregated – No PII'],
            updateFrequency: 'Quarterly', price: 49717,
            doi: '10.5281/auratral.pvm.21104',
            temporalCoverage: '2004 – 2025', completenessScore: 92.4, qualityScore: 87,
            description: `Curated, harmonised extract of 2.4 million de-duplicated adverse event reports. Drug names normalised to RxNorm, MedDRA coding applied to outcomes.\n\nIdeal for pharmacovigilance signal detection, drug-drug interaction research, and post-market safety analytics.`,
        },
        defaultCohort: {
            records: '2,400,000', gender: 'Per FAERS reporter data — approx. 55% Female / 45% Male',
            ageRange: 'All adult age groups', region: 'Global (FDA-sourced reports)',
            timePeriod: '2004 – 2025',
            conditions: 'All therapeutic categories, all seriousness levels',
            exclusions: 'Duplicate reports (de-duplicated by Auratral algorithm)',
            format: 'CSV',
        },
        columns: [
            { name: 'report_id', dtype: 'String', description: 'Unique FAERS report identifier', units: '—', nulls: 0, example: 'FAERS-20241023-0041', histogram: null },
            { name: 'drug_name_rxnorm', dtype: 'String', description: 'Suspect drug name normalised to RxNorm', units: '—', nulls: 0, example: 'Metformin 500 MG', histogram: null },
            { name: 'drug_role', dtype: 'String', description: 'Role: Primary Suspect / Concomitant / Interacting', units: '—', nulls: 0, example: 'Primary Suspect', histogram: null },
            { name: 'outcome_meddra', dtype: 'String', description: 'Adverse outcome coded to MedDRA Preferred Term', units: '—', nulls: 0, example: 'Lactic acidosis', histogram: null },
            { name: 'outcome_seriousness', dtype: 'Boolean', description: 'Flag: serious per FDA definition', units: '—', nulls: 0, example: 'true', histogram: [34, 66] },
            { name: 'hospitalization', dtype: 'Boolean', description: 'Flag: required hospitalisation', units: '—', nulls: 0, example: 'false', histogram: [58, 42] },
            { name: 'patient_age_group', dtype: 'String', description: 'Age group (decade buckets)', units: '—', nulls: 4820, example: '60–69', histogram: null },
            { name: 'patient_sex', dtype: 'String', description: 'Reported biological sex (M / F / UNK)', units: '—', nulls: 0, example: 'F', histogram: null },
            { name: 'report_year', dtype: 'Int32', description: 'Calendar year of report submission', units: 'Year', nulls: 0, example: '2023', histogram: [5, 6, 8, 10, 12, 14, 14, 13, 10, 8] },
            { name: 'reporter_type', dtype: 'String', description: 'Reporter type: Physician / Consumer / Pharmacist / Other', units: '—', nulls: 0, example: 'Physician', histogram: null },
        ],
        rows: [
            { report_id: 'FAERS-20241023-0041', drug_name_rxnorm: 'Metformin 500 MG', drug_role: 'Primary Suspect', outcome_meddra: 'Lactic acidosis', outcome_seriousness: 'true', hospitalization: 'true', patient_age_group: '60–69', patient_sex: 'F', report_year: 2024, reporter_type: 'Physician' },
            { report_id: 'FAERS-20230715-2290', drug_name_rxnorm: 'Atorvastatin 40 MG', drug_role: 'Primary Suspect', outcome_meddra: 'Myopathy', outcome_seriousness: 'false', hospitalization: 'false', patient_age_group: '50–59', patient_sex: 'M', report_year: 2023, reporter_type: 'Consumer' },
            { report_id: 'FAERS-20221108-8831', drug_name_rxnorm: 'Lisinopril 10 MG', drug_role: 'Primary Suspect', outcome_meddra: 'Angioedema', outcome_seriousness: 'true', hospitalization: 'true', patient_age_group: '40–49', patient_sex: 'M', report_year: 2022, reporter_type: 'Pharmacist' },
            { report_id: 'FAERS-20240301-5517', drug_name_rxnorm: 'Sertraline 50 MG', drug_role: 'Concomitant', outcome_meddra: 'QT prolongation', outcome_seriousness: 'true', hospitalization: 'false', patient_age_group: null, patient_sex: 'F', report_year: 2024, reporter_type: 'Physician' },
            { report_id: 'FAERS-20211204-3308', drug_name_rxnorm: 'Amoxicillin 250 MG', drug_role: 'Primary Suspect', outcome_meddra: 'Hypersensitivity', outcome_seriousness: 'false', hospitalization: 'false', patient_age_group: '20–29', patient_sex: 'F', report_year: 2021, reporter_type: 'Consumer' },
        ],
    },

    'AUR-GEN-00092': {
        meta: {
            name: 'Cancer Genome Atlas Subset',
            source: 'The Cancer Genome Atlas Program (TCGA) – Harmonised Subset',
            category: 'Genomics', subCategory: 'Oncology WGS',
            rating: 5.0, reviews: 47, records: '12,500', variables: 410,
            formats: ['VCF', 'CSV'],
            compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'],
            updateFrequency: 'Static Release', price: 'Custom',
            doi: '10.5281/auratral.gen.92215',
            temporalCoverage: '2010 – 2022', completenessScore: 98.6, qualityScore: 98,
            description: `Whole-genome sequencing data mapped to curated clinical oncology outcomes. Includes somatic mutations, copy-number variations, and transcriptomic profiles.\n\nPrimary use-cases: tumour mutation burden analysis, neoantigen prediction, and cancer driver gene discovery.`,
        },
        defaultCohort: {
            records: '12,847', gender: 'Cancer-type natural distribution (varies by cohort)',
            ageRange: '22 – 89 years', region: 'Multi-site (India + TCGA-aligned)',
            timePeriod: '2010 – 2024',
            conditions: '12 primary cancer types (solid tumour)',
            exclusions: 'Haematological malignancies, incomplete WGS coverage',
            format: 'VCF + CSV',
        },
        columns: [
            { name: 'sample_id', dtype: 'String', description: 'Unique TCGA-aligned tumour tissue sample barcode', units: '—', nulls: 0, example: 'TCGA-AB-2803-01', histogram: null },
            { name: 'cancer_type', dtype: 'String', description: 'TCGA study code indicating cancer of origin', units: '—', nulls: 0, example: 'LUAD', histogram: null },
            { name: 'tumor_stage', dtype: 'String', description: 'AJCC pathological tumour stage at diagnosis', units: '—', nulls: 312, example: 'Stage IIB', histogram: null },
            { name: 'variant_classification', dtype: 'String', description: 'Mutation effect classification', units: '—', nulls: 0, example: 'Missense_Mutation', histogram: null },
            { name: 'hugo_symbol', dtype: 'String', description: 'HGNC gene symbol harbouring the variant', units: '—', nulls: 0, example: 'TP53', histogram: null },
            { name: 'chromosome', dtype: 'String', description: 'Chromosome on which the variant resides', units: '—', nulls: 0, example: '17', histogram: null },
            { name: 'vaf', dtype: 'Float32', description: 'Variant allele frequency in tumour (0–1)', units: 'Fraction', nulls: 0, example: '0.43', histogram: [8, 14, 18, 22, 20, 14, 10, 6, 4, 2] },
            { name: 'tmb', dtype: 'Float32', description: 'Tumour mutation burden (mut/Mb)', units: 'mut/Mb', nulls: 0, example: '12.4', histogram: [35, 28, 18, 10, 5, 3, 2, 1, 1, 1] },
            { name: 'msi_status', dtype: 'String', description: 'Microsatellite instability status', units: '—', nulls: 0, example: 'MSS', histogram: null },
            { name: 'overall_survival_days', dtype: 'Int32', description: 'Overall survival in days from diagnosis', units: 'Days', nulls: 840, example: '542', histogram: [22, 18, 14, 12, 10, 8, 6, 5, 3, 2] },
        ],
        rows: [
            { sample_id: 'TCGA-AB-2803-01', cancer_type: 'LUAD', tumor_stage: 'Stage IIB', variant_classification: 'Missense_Mutation', hugo_symbol: 'TP53', chromosome: '17', vaf: 0.43, tmb: 12.4, msi_status: 'MSS', overall_survival_days: 542 },
            { sample_id: 'TCGA-AB-2941-01', cancer_type: 'BRCA', tumor_stage: 'Stage IA', variant_classification: 'Nonsense_Mutation', hugo_symbol: 'BRCA1', chromosome: '17', vaf: 0.51, tmb: 4.1, msi_status: 'MSS', overall_survival_days: 1820 },
            { sample_id: 'TCGA-AB-3012-01', cancer_type: 'COAD', tumor_stage: 'Stage III', variant_classification: 'Frame_Shift_Del', hugo_symbol: 'APC', chromosome: '5', vaf: 0.38, tmb: 18.7, msi_status: 'MSI-H', overall_survival_days: 924 },
            { sample_id: 'TCGA-AB-3307-01', cancer_type: 'GBM', tumor_stage: null, variant_classification: 'Missense_Mutation', hugo_symbol: 'EGFR', chromosome: '7', vaf: 0.62, tmb: 6.2, msi_status: 'MSS', overall_survival_days: 148 },
            { sample_id: 'TCGA-AB-4120-01', cancer_type: 'LUSC', tumor_stage: 'Stage IIA', variant_classification: 'Splice_Site', hugo_symbol: 'RB1', chromosome: '13', vaf: 0.29, tmb: 9.8, msi_status: 'MSS', overall_survival_days: 712 },
        ],
    },

    'AUR-MNT-00034': {
        meta: {
            name: 'PHQ-9 Population Cohort',
            source: 'National Mental Health Census – Anonymised Survey Corpus',
            category: 'Mental Health', subCategory: 'Depression Screening',
            rating: 4.6, reviews: 202, records: '340,000', variables: 62,
            formats: ['JSON', 'CSV'],
            compliance: ['GDPR-Ready', 'HIPAA', 'DPDP Compliant'],
            updateFrequency: 'Annually Refreshed', price: 16517,
            doi: '10.5281/auratral.mnt.34002',
            temporalCoverage: '2016 – 2024', completenessScore: 95.3, qualityScore: 89,
            description: `Large-scale depression screening results from a nationally representative population survey. PHQ-9 item-level scores linked to socioeconomic indicators, employment, sleep quality, and treatment-seeking behaviour.\n\nDesigned for epidemiological modelling and mental health policy analysis.`,
        },
        defaultCohort: {
            records: '78,234', gender: 'Stratified — 58% Female / 42% Male',
            ageRange: '18 – 65 years', region: 'Urban & semi-urban India (12 cities)',
            timePeriod: '2017 – 2024',
            conditions: 'PHQ-9, GAD-7, PCL-5 & PSS scales; all severity levels',
            exclusions: 'Diagnosed psychotic disorders, incomplete survey (<80%)',
            format: 'CSV',
        },
        columns: [
            { name: 'respondent_code', dtype: 'String', description: 'Anonymised unique survey respondent code', units: '—', nulls: 0, example: 'MH-2019-48201', histogram: null },
            { name: 'survey_year', dtype: 'Int32', description: 'Year the PHQ-9 was administered', units: 'Year', nulls: 0, example: '2021', histogram: [8, 10, 12, 14, 14, 13, 12, 10, 8, 6] },
            { name: 'age_group', dtype: 'String', description: 'Age bracket of respondent (decade)', units: '—', nulls: 0, example: '30–39', histogram: null },
            { name: 'gender_identity', dtype: 'String', description: 'Self-reported gender identity', units: '—', nulls: 0, example: 'Female', histogram: null },
            { name: 'phq9_total', dtype: 'Int32', description: 'Total PHQ-9 score (0 = none, 27 = severe)', units: 'Score', nulls: 0, example: '14', histogram: [20, 18, 16, 14, 12, 8, 6, 4, 2, 1] },
            { name: 'severity_category', dtype: 'String', description: 'Severity band: Minimal / Mild / Moderate / Moderately Severe / Severe', units: '—', nulls: 0, example: 'Moderate', histogram: null },
            { name: 'employment_status', dtype: 'String', description: 'Employment status at time of survey', units: '—', nulls: 1820, example: 'Employed Full-time', histogram: null },
            { name: 'sleep_hours_avg', dtype: 'Float32', description: 'Average nightly sleep hours (past 2 weeks)', units: 'Hours', nulls: 4200, example: '5.8', histogram: [4, 8, 14, 20, 24, 18, 10, 5, 2, 1] },
            { name: 'treatment_sought', dtype: 'Boolean', description: 'Flag: actively sought mental health treatment', units: '—', nulls: 0, example: 'false', histogram: [72, 28] },
            { name: 'socioeconomic_index', dtype: 'Float32', description: 'Socioeconomic deprivation index (0–100)', units: 'Index', nulls: 0, example: '62.4', histogram: [6, 10, 14, 16, 18, 16, 10, 6, 3, 1] },
        ],
        rows: [
            { respondent_code: 'MH-2021-48201', survey_year: 2021, age_group: '30–39', gender_identity: 'Female', phq9_total: 14, severity_category: 'Moderate', employment_status: 'Employed Full-time', sleep_hours_avg: 5.8, treatment_sought: 'false', socioeconomic_index: 62.4 },
            { respondent_code: 'MH-2020-19834', survey_year: 2020, age_group: '20–29', gender_identity: 'Male', phq9_total: 7, severity_category: 'Mild', employment_status: 'Student', sleep_hours_avg: 6.5, treatment_sought: 'false', socioeconomic_index: 44.1 },
            { respondent_code: 'MH-2022-77410', survey_year: 2022, age_group: '50–59', gender_identity: 'Female', phq9_total: 21, severity_category: 'Severe', employment_status: 'Unemployed', sleep_hours_avg: 4.2, treatment_sought: 'true', socioeconomic_index: 78.9 },
            { respondent_code: 'MH-2019-30012', survey_year: 2019, age_group: '40–49', gender_identity: 'Non-binary', phq9_total: 3, severity_category: 'Minimal', employment_status: null, sleep_hours_avg: null, treatment_sought: 'false', socioeconomic_index: 38.7 },
            { respondent_code: 'MH-2023-64519', survey_year: 2023, age_group: '60–69', gender_identity: 'Male', phq9_total: 17, severity_category: 'Moderately Severe', employment_status: 'Retired', sleep_hours_avg: 5.1, treatment_sought: 'true', socioeconomic_index: 55.2 },
        ],
    },

    'AUR-RLW-00105': {
        meta: {
            name: 'Real-World Diabetes Outcomes',
            source: 'Multi-centre Type 2 Diabetes Observational Registry',
            category: 'Trials', subCategory: 'Endocrinology – RWE',
            rating: 4.8, reviews: 78, records: '56,000', variables: 88,
            formats: ['Parquet', 'CSV'],
            compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'],
            updateFrequency: 'Semi-annually', price: 33117,
            doi: '10.5281/auratral.rlw.10543',
            temporalCoverage: '2012 – 2025', completenessScore: 96.7, qualityScore: 91,
            description: `Longitudinal HbA1c tracking and medication adherence data for 56,000 T2DM patients. Includes complication indicators and therapy escalation events over a 13-year follow-up.\n\nIdeal for treatment pathway modelling and real-world evidence generation for regulatory submissions.`,
        },
        defaultCohort: {
            records: '94,156', gender: 'Balanced — 48% Female / 52% Male',
            ageRange: '30 – 80 years', region: 'Pan-India (Type 1 & Type 2 cohorts)',
            timePeriod: '2013 – 2024',
            conditions: 'HbA1c 5.5 – 13.0%, 5-yr longitudinal follow-up',
            exclusions: 'Gestational diabetes, incomplete HbA1c (<3 readings)',
            format: 'CSV',
        },
        columns: [
            { name: 'enrolment_id', dtype: 'String', description: 'De-identified registry enrolment number', units: '—', nulls: 0, example: 'DM-ENC-041287', histogram: null },
            { name: 'diagnosis_year', dtype: 'Int32', description: 'Calendar year of T2DM diagnosis', units: 'Year', nulls: 0, example: '2015', histogram: [6, 8, 10, 12, 14, 14, 12, 10, 8, 6] },
            { name: 'age_at_diagnosis', dtype: 'Int32', description: 'Patient age at diabetes diagnosis', units: 'Years', nulls: 0, example: '54', histogram: [2, 5, 12, 22, 30, 28, 20, 12, 5, 2] },
            { name: 'bmi', dtype: 'Float32', description: 'Body mass index at enrolment', units: 'kg/m²', nulls: 0, example: '31.2', histogram: [2, 6, 14, 24, 30, 24, 16, 8, 4, 2] },
            { name: 'baseline_hba1c', dtype: 'Float32', description: 'HbA1c at cohort entry (%)', units: '%', nulls: 0, example: '8.4', histogram: [4, 10, 22, 32, 26, 18, 10, 5, 2, 1] },
            { name: 'latest_hba1c', dtype: 'Float32', description: 'Most recent HbA1c in follow-up', units: '%', nulls: 2140, example: '7.1', histogram: [6, 14, 28, 30, 22, 14, 8, 4, 2, 1] },
            { name: 'first_line_drug', dtype: 'String', description: 'First prescribed anti-diabetic medication class', units: '—', nulls: 0, example: 'Metformin', histogram: null },
            { name: 'therapy_escalated', dtype: 'Boolean', description: 'Flag: therapy escalation event', units: '—', nulls: 0, example: 'true', histogram: [48, 52] },
            { name: 'nephropathy', dtype: 'Boolean', description: 'Flag: diabetic nephropathy complication', units: '—', nulls: 0, example: 'false', histogram: [78, 22] },
            { name: 'follow_up_years', dtype: 'Float32', description: 'Total follow-up duration in years', units: 'Years', nulls: 0, example: '6.3', histogram: [12, 18, 20, 18, 14, 10, 5, 2, 1, 1] },
        ],
        rows: [
            { enrolment_id: 'DM-ENC-041287', diagnosis_year: 2015, age_at_diagnosis: 54, bmi: 31.2, baseline_hba1c: 8.4, latest_hba1c: 7.1, first_line_drug: 'Metformin', therapy_escalated: 'true', nephropathy: 'false', follow_up_years: 6.3 },
            { enrolment_id: 'DM-ENC-008941', diagnosis_year: 2018, age_at_diagnosis: 62, bmi: 28.7, baseline_hba1c: 9.1, latest_hba1c: 7.8, first_line_drug: 'Metformin', therapy_escalated: 'true', nephropathy: 'true', follow_up_years: 4.1 },
            { enrolment_id: 'DM-ENC-101530', diagnosis_year: 2012, age_at_diagnosis: 47, bmi: 34.5, baseline_hba1c: 7.8, latest_hba1c: null, first_line_drug: 'Sulfonylurea', therapy_escalated: 'false', nephropathy: 'false', follow_up_years: 10.2 },
            { enrolment_id: 'DM-ENC-073812', diagnosis_year: 2020, age_at_diagnosis: 38, bmi: 26.1, baseline_hba1c: 8.9, latest_hba1c: 6.8, first_line_drug: 'Metformin', therapy_escalated: 'false', nephropathy: 'false', follow_up_years: 2.8 },
            { enrolment_id: 'DM-ENC-055627', diagnosis_year: 2016, age_at_diagnosis: 70, bmi: 30.8, baseline_hba1c: 10.2, latest_hba1c: 8.3, first_line_drug: 'Insulin (Basal)', therapy_escalated: 'true', nephropathy: 'true', follow_up_years: 7.9 },
        ],
    },
};

const FALLBACK_ID = 'AUR-EHR-00087';

/* mini SVG histogram */
const MiniHistogram = ({ values, color = '#6366f1' }) => {
    if (!values || values.length === 0) return null;
    const max = Math.max(...values);
    const w = 180, h = 48, gap = 2;
    const barW = (w - gap * (values.length - 1)) / values.length;
    return (
        <svg width={w} height={h} className="mt-2">
            {values.map((v, i) => {
                const barH = max > 0 ? (v / max) * (h - 4) : 0;
                return <rect key={i} x={i * (barW + gap)} y={h - barH} width={barW} height={barH} rx={2} fill={color} opacity={0.75} />;
            })}
        </svg>
    );
};

const SimulatedMedicalScan = ({ imageId, category, findingLabel, filterStyle = {} }) => {
    const idStr = String(imageId).toLowerCase();
    
    // Dermatology (Dermatoscopic mole)
    if (category === 'Imaging' && idStr.includes('img-208')) {
        const isMelanoma = String(findingLabel).toLowerCase().includes('melanoma') || String(findingLabel).toLowerCase().includes('carcinoma');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#f0c3a2] rounded-lg" style={filterStyle}>
                <circle cx="40" cy="50" r="1.5" fill="#e0b090" opacity="0.6" />
                <circle cx="150" cy="120" r="2" fill="#e0b090" opacity="0.6" />
                <circle cx="80" cy="160" r="1" fill="#e0b090" opacity="0.6" />
                <path d="M 20 40 Q 60 70 80 60" stroke="#5a4230" strokeWidth="0.8" fill="none" opacity="0.4" />
                <path d="M 120 150 Q 150 170 170 140" stroke="#5a4230" strokeWidth="0.8" fill="none" opacity="0.4" />
                {isMelanoma ? (
                    <path 
                        d="M 80 80 C 60 90, 70 130, 95 125 C 120 120, 130 95, 110 75 C 95 60, 90 70, 80 80 Z" 
                        fill="url(#melanomaGrad)" 
                        stroke="#271c15" 
                        strokeWidth="1.5" 
                    />
                ) : (
                    <circle cx="100" cy="100" r="25" fill="url(#nevusGrad)" stroke="#4e3524" strokeWidth="0.8" />
                )}
                <defs>
                    <radialGradient id="melanomaGrad" cx="45%" cy="45%" r="55%">
                        <stop offset="0%" stopColor="#1c110b" />
                        <stop offset="40%" stopColor="#432818" />
                        <stop offset="75%" stopColor="#7f4f24" />
                        <stop offset="100%" stopColor="#b07d62" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="nevusGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4a301a" />
                        <stop offset="85%" stopColor="#6f4e37" />
                        <stop offset="100%" stopColor="#9a7b56" stopOpacity="0.3" />
                    </radialGradient>
                </defs>
            </svg>
        );
    }

    // Ophthalmology (Retinal Fundus scan)
    if (category === 'Imaging' && idStr.includes('img-207')) {
        const hasDR = !String(findingLabel).toLowerCase().includes('normal');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#120502] rounded-lg" style={filterStyle}>
                <circle cx="100" cy="100" r="90" fill="#e65c00" opacity="0.85" stroke="#cc3300" strokeWidth="2" />
                <circle cx="60" cy="100" r="16" fill="#ffe066" filter="blur(1px)" />
                <path d="M 60 100 Q 80 70 120 60 T 170 50" stroke="#990000" strokeWidth="2" fill="none" opacity="0.8" />
                <path d="M 60 100 Q 90 120 130 130 T 180 150" stroke="#990000" strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 60 100 Q 50 60 30 40 T 10 20" stroke="#990000" strokeWidth="1.5" fill="none" opacity="0.8" />
                <path d="M 60 100 Q 40 130 20 150" stroke="#990000" strokeWidth="1.8" fill="none" opacity="0.8" />
                <path d="M 100 65 Q 110 50 130 45" stroke="#990000" strokeWidth="0.8" fill="none" opacity="0.7" />
                <path d="M 110 125 Q 125 110 150 115" stroke="#990000" strokeWidth="0.8" fill="none" opacity="0.7" />
                {hasDR && (
                    <>
                        <circle cx="120" cy="85" r="2" fill="#ff0000" />
                        <circle cx="140" cy="105" r="1.5" fill="#ff0000" />
                        <circle cx="95" cy="120" r="2.5" fill="#ff0000" />
                        <circle cx="135" cy="75" r="3" fill="#ffffcc" opacity="0.9" filter="blur(0.5px)" />
                        <path d="M 145 90 Q 150 92 148 95 Z" fill="#ffffcc" opacity="0.9" filter="blur(0.5px)" />
                        <circle cx="115" cy="140" r="4" fill="#ffffcc" opacity="0.8" filter="blur(0.5px)" />
                        <path d="M 105 100 Q 108 97 112 102 Z" fill="#b30000" opacity="0.9" />
                        <path d="M 125 125 Q 128 132 122 130 Z" fill="#b30000" opacity="0.9" />
                    </>
                )}
            </svg>
        );
    }

    // Neuro-oncology / Pelvic MRI
    if (category === 'Imaging' && (idStr.includes('img-202') || idStr.includes('img-2010'))) {
        const isNormal = String(findingLabel).toLowerCase().includes('normal');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#050508] rounded-lg" style={filterStyle}>
                <path d="M 100 25 C 50 25, 40 60, 40 100 C 40 140, 55 170, 100 170 C 145 170, 160 140, 160 100 C 160 60, 150 25, 100 25 Z" fill="#151520" stroke="#555" strokeWidth="2" />
                <path d="M 100 35 C 65 35, 50 65, 50 100 C 50 135, 65 160, 100 160 C 135 160, 150 135, 150 100 C 150 65, 135 35, 100 35 Z" fill="#252535" opacity="0.8" />
                <path d="M 85 90 C 85 70, 95 65, 95 80 C 95 95, 85 105, 85 90 Z" fill="#0c0c12" stroke="#444" strokeWidth="0.5" />
                <path d="M 115 90 C 115 70, 105 65, 105 80 C 105 95, 115 105, 115 90 Z" fill="#0c0c12" stroke="#444" strokeWidth="0.5" />
                <path d="M 70 140 Q 100 125 130 140 Q 100 165 70 140 Z" fill="#1c1c28" opacity="0.9" stroke="#3c3c4c" strokeWidth="0.5" />
                <line x1="100" y1="35" x2="100" y2="135" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                {!isNormal && (
                    <circle cx="130" cy="90" r="16" fill="url(#mriLesion)" filter="blur(1.5px)" className="animate-pulse" />
                )}
                <defs>
                    <radialGradient id="mriLesion" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="35%" stopColor="#e0e0ff" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#a0a0ff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#5050ff" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        );
    }

    // Cardiac Ultrasound / Thyroid Ultrasound
    if (category === 'Imaging' && (idStr.includes('img-204') || idStr.includes('img-209'))) {
        const hasLesion = !String(findingLabel).toLowerCase().includes('normal');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#020205] rounded-lg" style={filterStyle}>
                <path d="M 100 20 L 30 170 A 90 90 0 0 0 170 170 Z" fill="#05101a" stroke="#1c2f42" strokeWidth="1" />
                <path d="M 100 20 L 50 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 100 20 L 75 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 100 20 L 125 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 100 20 L 150 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 75 90 Q 100 70 125 90 T 100 150 Z" fill="none" stroke="#2a4d6c" strokeWidth="2.5" opacity="0.75" />
                <path d="M 85 100 Q 100 85 115 100" stroke="#2a4d6c" strokeWidth="1.5" fill="none" opacity="0.6" />
                <line x1="100" y1="80" x2="100" y2="150" stroke="#2a4d6c" strokeWidth="1.5" opacity="0.6" />
                {hasLesion && (
                    <path d="M 100 95 Q 110 110 95 130" stroke="url(#flowJet)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" filter="blur(1px)" />
                )}
                <defs>
                    <linearGradient id="flowJet" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff3300" />
                        <stop offset="50%" stopColor="#ffcc00" />
                        <stop offset="100%" stopColor="#3399ff" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    // Chest X-Ray / Mammography / Musculoskeletal Joint X-Ray / Abdominal CT Scan
    const isNormal = String(findingLabel).toLowerCase().includes('normal');
    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#050505] rounded-lg" style={filterStyle}>
            <line x1="100" y1="20" x2="100" y2="180" stroke="#444" strokeWidth="6" opacity="0.8" />
            <path d="M 90 20 L 110 20 M 88 50 L 112 50 M 85 80 L 115 80 M 82 110 L 118 110 M 85 140 L 115 140 M 88 170 L 112 170" stroke="#3a3a3a" strokeWidth="3" opacity="0.8" />
            <path d="M 100 40 Q 50 30 40 60" fill="none" stroke="#555" strokeWidth="4" opacity="0.8" />
            <path d="M 100 40 Q 150 30 160 60" fill="none" stroke="#555" strokeWidth="4" opacity="0.8" />
            <path d="M 100 65 Q 40 50 30 90" fill="none" stroke="#555" strokeWidth="4.5" opacity="0.8" />
            <path d="M 100 65 Q 160 50 170 90" fill="none" stroke="#555" strokeWidth="4.5" opacity="0.8" />
            <path d="M 100 90 Q 35 75 25 120" fill="none" stroke="#555" strokeWidth="5" opacity="0.7" />
            <path d="M 100 90 Q 165 75 175 120" fill="none" stroke="#555" strokeWidth="5" opacity="0.7" />
            <path d="M 100 115 Q 35 100 25 150" fill="none" stroke="#555" strokeWidth="5" opacity="0.6" />
            <path d="M 100 115 Q 165 100 175 150" fill="none" stroke="#555" strokeWidth="5" opacity="0.6" />
            <path d="M 100 25 Q 70 20 45 28" fill="none" stroke="#666" strokeWidth="4" opacity="0.8" />
            <path d="M 100 25 Q 130 20 155 28" fill="none" stroke="#666" strokeWidth="4" opacity="0.8" />
            <path d="M 90 35 C 65 30 50 55 45 110 C 45 140 70 145 90 140 Z" fill="#121212" opacity="0.7" stroke="#222" strokeWidth="1" />
            <path d="M 110 35 C 135 30 150 55 155 110 C 155 140 130 145 110 140 Z" fill="#121212" opacity="0.7" stroke="#222" strokeWidth="1" />
            <path d="M 95 85 C 80 90 85 125 115 130 C 115 110 110 90 95 85 Z" fill="#1a1a1a" opacity="0.95" stroke="#2d2d2d" strokeWidth="1.5" />
            {!isNormal && (
                <circle cx="65" cy="75" r="14" fill="url(#xrayLesion)" filter="blur(1px)" className="animate-pulse" />
            )}
            <defs>
                <radialGradient id="xrayLesion" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#e5e5e5" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#cccccc" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#aaaaaa" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
};

const DicomViewerModal = ({ isOpen, onClose, row, category }) => {
    const [contrast, setContrast] = useState(100);
    const [brightness, setBrightness] = useState(100);
    const [invert, setInvert] = useState(false);
    const [showAnnotations, setShowAnnotations] = useState(true);

    if (!isOpen || !row) return null;

    const finding = row.finding_label || row.finding || row.diagnosis || 'Normal';
    const imageId = row.image_id || 'IMG-001';

    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
        transition: 'filter 0.15s ease'
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center border-r border-slate-900 relative min-h-[300px] md:min-h-[500px]">
                    <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 flex flex-col gap-1 z-10">
                        <div>ID: {imageId}</div>
                        <div>MOD: {row.scan_modality || 'DICOM'}</div>
                        <div>SIZE: 512 x 512 px</div>
                    </div>
                    
                    <div className="w-full max-w-[360px] aspect-square relative flex items-center justify-center border border-slate-900 bg-slate-950/40 rounded-xl overflow-hidden shadow-inner">
                        <SimulatedMedicalScan 
                            imageId={imageId} 
                            category={category} 
                            findingLabel={finding} 
                            filterStyle={filterStyle} 
                        />
                        
                        {showAnnotations && !String(finding).toLowerCase().includes('normal') && (
                            <div className="absolute w-[25%] h-[25%] border-2 border-dashed border-red-500 rounded-lg animate-pulse" style={{ top: '35%', left: '28%' }}>
                                <span className="absolute -top-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30">
                                    {finding}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-600 z-10">
                        AURATRAL CLINICAL SCAN SIMULATOR v1.0 • WATERMARKED
                    </div>
                </div>

                <div className="w-full md:w-[320px] bg-slate-900 p-6 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">PACS Viewer</span>
                                <h3 className="text-lg font-bold text-white mt-2">DICOM Visualizer</h3>
                            </div>
                            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">DICOM Header Tags</h4>
                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs">
                                <span className="text-slate-500">Patient Age:</span>
                                <span className="text-slate-200 font-semibold font-mono">{row.patient_age || row.age || 'N/A'} yrs</span>
                                
                                <span className="text-slate-500">Patient Gender:</span>
                                <span className="text-slate-200 font-semibold font-mono">{row.gender || 'N/A'}</span>
                                
                                <span className="text-slate-500">Clinical Finding:</span>
                                <span className="text-indigo-400 font-bold">{finding}</span>

                                {row.lesion_diameter_mm !== undefined && (
                                    <>
                                        <span className="text-slate-500">Diameter:</span>
                                        <span className="text-slate-200 font-mono">{row.lesion_diameter_mm} mm</span>
                                    </>
                                )}

                                {row.confidence_score !== undefined && (
                                    <>
                                        <span className="text-slate-500">Confidence:</span>
                                        <span className="text-slate-200 font-mono">{(row.confidence_score * 100).toFixed(0)}%</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
                                <Sliders size={13} className="text-indigo-400" /> Controls
                            </h4>
                            
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Contrast</span>
                                        <span className="text-slate-500 font-mono">{contrast}%</span>
                                    </div>
                                    <input 
                                        type="range" min="50" max="150" value={contrast} 
                                        onChange={e => setContrast(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Brightness</span>
                                        <span className="text-slate-500 font-mono">{brightness}%</span>
                                    </div>
                                    <input 
                                        type="range" min="50" max="150" value={brightness} 
                                        onChange={e => setBrightness(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 text-xs">
                                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" checked={invert} 
                                        onChange={e => setInvert(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" 
                                    />
                                    Invert Colors
                                </label>
                                
                                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" checked={showAnnotations} 
                                        onChange={e => setShowAnnotations(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" 
                                    />
                                    Overlay Annotations
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col gap-2">
                        <button 
                            onClick={() => {
                                const blob = new Blob(["Simulated DICOM image data headers"], { type: "application/dicom" });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = `${imageId}_dicom.dcm`;
                                link.click();
                            }}
                            className="w-full btn btn-primary text-xs py-2"
                        >
                            Download Raw DICOM file (.dcm)
                        </button>
                        <button 
                            onClick={() => {
                                const svgElement = document.querySelector('.bg-black svg');
                                if (svgElement) {
                                    const svgString = new XMLSerializer().serializeToString(svgElement);
                                    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                                    const link = document.createElement("a");
                                    link.href = URL.createObjectURL(svgBlob);
                                    link.download = `${imageId}_preview.svg`;
                                    link.click();
                                }
                            }}
                            className="w-full btn btn-outline text-xs py-2"
                        >
                            Download JPEG Preview (.svg)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CellValue = ({ val, colName, row, category, handleOpenViewer }) => {
    if (val === null || val === undefined) return <span className="text-slate-600 italic text-xs">null</span>;
    if (val === 'true') return <span className="text-green-400 font-semibold text-xs">true</span>;
    if (val === 'false') return <span className="text-slate-400 text-xs">false</span>;
    
    if (colName === 'image_id' && category === 'Imaging') {
        return (
            <button 
                onClick={() => handleOpenViewer(row)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-mono text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded transition-all border border-indigo-500/20 active:scale-95 shrink-0"
            >
                <Eye size={12} /> {String(val)}
            </button>
        );
    }
    
    return <span className="text-slate-200 text-xs font-mono">{String(val)}</span>;
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const DatasetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [datasetData, setDatasetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerRow, setViewerRow] = useState(null);

    const handleOpenViewer = (row) => {
        setViewerRow(row);
        setViewerOpen(true);
    };

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const docRef = doc(db, 'datasets', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDatasetData(docSnap.data());
                } else if (DATASET_REGISTRY[id]) {
                    setDatasetData(DATASET_REGISTRY[id]);
                } else {
                    const keys = Object.keys(DATASET_REGISTRY);
                    const matchingKey = keys.find(k => k.toLowerCase() === id?.toLowerCase()) || FALLBACK_ID;
                    setDatasetData(DATASET_REGISTRY[matchingKey]);
                }
            } catch (err) {
                console.error("Error fetching dataset from Firestore: ", err);
                if (DATASET_REGISTRY[id]) {
                    setDatasetData(DATASET_REGISTRY[id]);
                } else {
                    setDatasetData(DATASET_REGISTRY[FALLBACK_ID]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDataset();
    }, [id]);

    const handleProtectedAction = (e, path) => {
        e.preventDefault();
        if (!user) navigate('/login');
        else if (path) navigate(path, { state: { datasetId: datasetData?.id } });
        else alert('This action requires a simulated backend response.');
    };

    if (loading) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="text-center relative z-10">
                    <div className="inline-flex w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
                    <p className="text-slate-400 text-sm tracking-wide">Syncing Clinical Metadata...</p>
                </div>
            </div>
        );
    }

    if (!datasetData) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Dataset Not Found</h2>
                    <Link to="/gallery" className="btn btn-outline">Return to Gallery</Link>
                </div>
            </div>
        );
    }

    // Map database flat schema to details fields expected by the render code
    const dataset = datasetData.meta ? datasetData.meta : {
        name: datasetData.name,
        source: datasetData.source || 'Multi-site Clinical Study Network',
        category: datasetData.category,
        subCategory: datasetData.subCategory,
        rating: datasetData.rating || 4.8,
        reviews: datasetData.reviews || 12,
        records: datasetData.records,
        variables: datasetData.columns.length,
        formats: datasetData.formats,
        compliance: datasetData.compliance,
        updateFrequency: datasetData.updateFrequency || 'Quarterly Refreshed',
        price: datasetData.price,
        doi: datasetData.doi,
        temporalCoverage: datasetData.temporalCoverage || '2020 – 2025',
        completenessScore: datasetData.completenessScore || 98.5,
        qualityScore: datasetData.qualityScore || 92,
        description: datasetData.description
    };

    const defaultCohort = datasetData.defaultCohort ? datasetData.defaultCohort : {
        records: datasetData.records,
        gender: 'Balanced — 50% Male / 50% Female',
        ageRange: '18 – 85 years',
        region: 'Pan-India Cohort',
        timePeriod: dataset.temporalCoverage,
        conditions: `All ${datasetData.subCategory} patient admission types`,
        exclusions: 'PII, incomplete records',
        format: datasetData.formats[0]
    };

    const MOCK_COLUMNS = datasetData.columns;
    const SAMPLE_ROWS = datasetData.rows;

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'cohort', label: 'Default Cohort', icon: Users },
        { id: 'sample', label: 'Data Sample', icon: Eye },
        { id: 'columns', label: 'Column Details', icon: Table },
        { id: 'delivery', label: 'Delivery Options', icon: Download },
    ];

    const totalNulls = MOCK_COLUMNS.reduce((s, c) => s + c.nulls, 0);
    const histColors = { Float32: '#6366f1', Int32: '#8b5cf6', DateTime: '#06b6d4', Boolean: '#10b981', String: '#f59e0b' };

    return (
        <div className="pt-32 pb-16 min-h-screen">

            {/* ── Header ── */}
            <div className="bg-slate-800/50 border-b border-glass-border pt-6 pb-12 mb-8">
                <div className="container mx-auto px-8">
                    <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
                        <div className="max-w-3xl">
                            <div className="flex gap-2 mb-4">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">{dataset.category}</span>
                                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{dataset.subCategory}</span>
                                <span className="text-xs px-2 py-1 rounded bg-slate-900 text-slate-500 border border-slate-700 font-mono">{dataKey}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">{dataset.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-300 mb-6">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold text-primary">{dataset.rating}</span>
                                    <span className="text-slate-500">({dataset.reviews} verified reviews)</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-600" />
                                <div className="flex items-center gap-2 text-slate-400">
                                    <ShieldCheck size={16} className="text-blue-500" /> Auratral Compliance Verified
                                </div>
                            </div>
                            <p className="text-secondary leading-relaxed whitespace-pre-line">{dataset.description}</p>
                        </div>

                        {/* Pricing panel */}
                        <div className="glass-panel p-6 w-full lg:w-80 shrink-0 lg:-mt-4 lg:sticky lg:top-32 border-purple-500/20">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Base Research License</div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-primary">
                                    {typeof dataset.price === 'number' ? `₹${dataset.price.toLocaleString()}` : dataset.price}
                                </span>
                                {typeof dataset.price === 'number' && <span className="text-slate-500 text-sm">/ subset</span>}
                            </div>
                            {defaultCohort && (
                                <p className="text-xs text-slate-500 mb-4">Default cohort: {defaultCohort.records} records · {defaultCohort.gender.split('—')[0].trim()}</p>
                            )}
                            <button onClick={(e) => handleProtectedAction(e, '/customize')} className="w-full btn btn-primary py-3 justify-center mb-3 cursor-pointer text-center block">
                                Customize Cohort & Buy
                            </button>
                            <button onClick={(e) => handleProtectedAction(e, null)} className="w-full btn btn-outline py-2 text-sm justify-center mb-6 cursor-pointer text-center block">
                                Request Free Data Sample
                            </button>
                            <div className="space-y-3 pt-4 border-t border-glass-border text-sm text-slate-300">
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> {dataset.records} Records</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> {dataset.variables} Variables</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> {dataset.formats.join(', ')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab bar ── */}
            <div className="container mx-auto px-8 mb-8">
                <div className="flex gap-1 overflow-x-auto border-b border-slate-800 pb-0">
                    {tabs.map(({ id: tid, label, icon: Icon }) => (
                        <button key={tid} onClick={() => setActiveTab(tid)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tid ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <Icon size={15} />{label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab panels ── */}
            <div className="container mx-auto px-8">

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass-panel p-8">
                            <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Dataset Metadata</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {[
                                    ['Data Source', dataset.source],
                                    ['Temporal Coverage', dataset.temporalCoverage],
                                    ['Update Frequency', dataset.updateFrequency],
                                    ['De-identification', dataset.compliance[0]],
                                    ['Variables', `${dataset.variables} columns`],
                                    ['DOI', dataset.doi],
                                    ['Auratral Quality Score', `${dataset.qualityScore} / 100`],
                                ].map(([label, val]) => (
                                    <div key={label}>
                                        <div className="text-xs text-slate-500 mb-1">{label}</div>
                                        <div className={`text-sm font-medium ${label === 'Auratral Quality Score' ? 'text-blue-400 text-lg font-bold' : label === 'DOI' ? 'text-indigo-400 font-mono text-xs hover:underline cursor-pointer' : 'text-primary'}`}>{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel p-8">
                            <h2 className="text-xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Data Quality</h2>
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-slate-400 mb-2"><span>Completeness</span><span className="text-green-400 font-semibold">{dataset.completenessScore}%</span></div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-green-400 rounded-full" style={{ width: `${dataset.completenessScore}%` }} />
                                </div>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                {['Duplicate detection', 'Date & temporal validation', 'Value range checks', 'Outlier flagging', 'Cross-site harmonisation'].map(item => (
                                    <li key={item} className="flex items-start gap-2"><CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />{item}</li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-glass-border">
                                <div className="text-xs text-slate-500 mb-1">Total null values (all columns)</div>
                                <div className="text-lg font-bold text-primary font-mono">{totalNulls.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DEFAULT COHORT */}
                {activeTab === 'cohort' && defaultCohort && (
                    <div className="space-y-6">
                        <div className="glass-panel p-6 border-l-4 border-l-indigo-500 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-primary mb-1">Default Cohort</h2>
                                <p className="text-sm text-slate-400">This is exactly what you get at the base price — all demographic parameters pre-set to maximise representativeness. No customisation required.</p>
                            </div>
                            {typeof dataset.price === 'number' && (
                                <div className="shrink-0 flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3">
                                    <span className="text-2xl">✅</span>
                                    <div>
                                        <div className="text-xs text-slate-400">Included in base price</div>
                                        <div className="font-bold text-indigo-400">₹{dataset.price.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel p-8">
                            <h3 className="text-lg font-bold text-primary mb-6 border-b border-glass-border pb-3">Cohort Parameters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: 'Total Records', value: defaultCohort.records, icon: '📦' },
                                    { label: 'Gender Distribution', value: defaultCohort.gender, icon: '⚖️' },
                                    { label: 'Age Range', value: defaultCohort.ageRange, icon: '🎂' },
                                    { label: 'Geographic Scope', value: defaultCohort.region, icon: '🗺️' },
                                    { label: 'Temporal Coverage', value: defaultCohort.timePeriod, icon: '📅' },
                                    { label: 'Conditions / Scope', value: defaultCohort.conditions, icon: '🔬' },
                                    { label: 'Exclusion Criteria', value: defaultCohort.exclusions, icon: '🚫' },
                                    { label: 'Default Format', value: defaultCohort.format, icon: '📄' },
                                ].map(({ label, value, icon }) => (
                                    <div key={label} className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 hover:border-indigo-500/30 transition-colors">
                                        <span className="text-2xl shrink-0">{icon}</span>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">{label}</div>
                                            <div className="text-sm text-slate-200 font-medium">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-6 bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border border-indigo-500/20">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
                                <div>
                                    <h3 className="font-bold text-primary mb-1">Need a custom cohort?</h3>
                                    <p className="text-sm text-slate-400">Filter by age band, diagnosis codes, specific gender, districts, or date range. Available as a paid add-on at checkout.</p>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <Link to="/custom-request" className="btn btn-outline text-sm py-2 px-5">Custom Request</Link>
                                    <button onClick={(e) => handleProtectedAction(e, '/customize')} className="btn btn-primary text-sm py-2 px-5">Configure Cohort</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DATA SAMPLE */}
                {activeTab === 'sample' && (
                    <div className="glass-panel p-8">
                        <div className="flex items-center justify-between mb-6 border-b border-glass-border pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">Data Sample</h2>
                                <p className="text-sm text-slate-400 mt-1">Showing 5 of {dataset.records} de-identified records · {MOCK_COLUMNS.length} columns</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/60 border border-slate-700 px-3 py-2 rounded-lg">
                                <Database size={13} className="text-indigo-400" /> All PII removed per {dataset.compliance[0]}
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
                            <table className="w-full text-sm min-w-max">
                                <thead>
                                    <tr className="bg-slate-800/80 border-b border-slate-700">
                                        {MOCK_COLUMNS.map(col => (
                                            <th key={col.name} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                                <div>{col.name}</div>
                                                <div className="font-normal normal-case text-slate-600 text-[10px]">{col.dtype}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SAMPLE_ROWS.map((row, ri) => (
                                        <tr key={ri} className={`border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors ${ri % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                                            {MOCK_COLUMNS.map(col => (
                                                <td key={col.name} className="px-4 py-3 whitespace-nowrap">
                                                    <CellValue val={row[col.name]} colName={col.name} row={row} category={dataset.category} handleOpenViewer={handleOpenViewer} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* COLUMN DETAILS */}
                {activeTab === 'columns' && (
                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Column Details <span className="text-base font-normal text-slate-400 ml-2">{MOCK_COLUMNS.length} columns</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MOCK_COLUMNS.map(col => {
                                const barColor = histColors[col.dtype] || '#6366f1';
                                return (
                                    <div key={col.name} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 space-y-3 hover:border-slate-600 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="font-mono font-bold text-primary">{col.name}</span>
                                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{col.dtype}</span>
                                            </div>
                                            {col.nulls > 0
                                                ? <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded-lg whitespace-nowrap">{col.nulls.toLocaleString()} nulls</span>
                                                : <span className="text-[10px] bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-1 rounded-lg whitespace-nowrap">No nulls</span>
                                            }
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{col.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                            {col.units !== '—' && (
                                                <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                                                    <div className="text-slate-500 mb-0.5">Units</div>
                                                    <div className="text-slate-200 font-medium">{col.units}</div>
                                                </div>
                                            )}
                                            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                                                <div className="text-slate-500 mb-0.5">Example</div>
                                                <div className="text-slate-200 font-mono truncate">{col.example}</div>
                                            </div>
                                        </div>
                                        {col.histogram && (
                                            <div>
                                                <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1"><BarChart2 size={11} /> Distribution</div>
                                                <MiniHistogram values={col.histogram} color={barColor} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* DELIVERY */}
                {activeTab === 'delivery' && (
                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Delivery Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg"><Download size={24} /></div>
                                <h3 className="font-bold text-primary mb-2">Direct Download</h3>
                                <p className="text-xs text-slate-400 mb-4">Secure, signed URLs for raw file extraction.</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                    {dataset.formats.filter(f => ['CSV', 'Parquet', 'JSON', 'VCF', 'DICOM', 'SQL'].includes(f)).map(f => (
                                        <span key={f} className="text-[10px] bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded text-slate-300">{f}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg"><Code2 size={24} /></div>
                                <h3 className="font-bold text-primary mb-2">REST API Endpoint</h3>
                                <p className="text-xs text-slate-400 mb-4">Paginated, queryable access via Auratral keys.</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                    <span className="text-[10px] bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded text-slate-300">JSON</span>
                                    {dataset.formats.includes('FHIR R4') && <span className="text-[10px] bg-slate-800 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-400 font-semibold">FHIR R4</span>}
                                </div>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg"><Box size={24} /></div>
                                <h3 className="font-bold text-primary mb-2">Docker Container</h3>
                                <p className="text-xs text-slate-400">Pre-loaded in PostgreSQL with Jupyter env.</p>
                                <div className="mt-auto pt-4 text-[10px] font-bold text-purple-400 uppercase tracking-widest">Enterprise Tier</div>
                            </div>
                        </div>
                    </div>
                )}

                <DicomViewerModal 
                    isOpen={viewerOpen} 
                    onClose={() => { setViewerOpen(false); setViewerRow(null); }} 
                    row={viewerRow} 
                    category={dataset.category} 
                />
            </div>
        </div>
    );
};

export default DatasetDetail;
