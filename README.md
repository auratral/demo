# Auratral MVP

So this is what happens when you spend way too many late nights thinking about how broken healthcare data access is in India.

Auratral started as a frustration. Genuinely. We kept running into the same wall -- researchers, startups, and AI teams all struggling to find clean, usable, compliance-ready medical datasets. The data exists. It's out there. But getting your hands on it? That's a different story. You're looking at months of paperwork, shady intermediaries, questionable data quality, and zero standardization. We figured someone should just fix that.

This is our attempt.

## What even is this

Auratral is a Data-as-a-Service platform. Not a marketplace. That distinction matters to us. We don't just list datasets and hope for the best. The whole idea is that raw clinical data goes through a pipeline on our end -- acquisition from certified partners, de-identification so it actually respects patient privacy, annotation by people who know what they're looking at, and then packaging it all into formats that plug right into your ML workflows. FHIR, CSV, JSON, whatever you need.

Think of it as the processing layer between messy hospital systems and your Jupyter notebook.

## The stack

Built with React and Vite because we wanted something fast. Tailwind handles most of the styling. Firebase sits underneath for auth, Firestore for data, and the whole thing deploys pretty painlessly. Framer Motion gives us the animations -- some might say we went overboard with those but honestly the site just felt dead without them.

Here's what's under the hood:
- React 18 with React Router v6
- Vite for bundling (sub-second HMR, it's beautiful)
- Firebase Auth with email/password plus Google and GitHub OAuth
- Cloud Firestore for datasets, purchases, and user profiles
- Framer Motion throughout
- Lucide React for icons
- Fully responsive, works fine on mobile

## What you'll find in here

The gallery page is where most of the action is. Sixty synthetic clinical datasets across six medical domains -- EHR, imaging, pharma, genomics, mental health, and clinical trials. Each one has realistic records, proper schemas, and actual downloadable files. The filters work. Search works. Sorting works. All of it.

There's a full checkout flow. You pick a dataset, customize your cohort (record count, format, demographics), sign a data use agreement, fill out an IRB ethics review form, and then pay. Payment is simulated obviously -- this is an MVP, we're not processing real money yet. But you get an actual file download at the end. CSV, JSON, FHIR R4, VCF, SQL -- depends on what you picked.

The provider dashboard lets data providers submit datasets for validation. Consumer dashboard shows your purchased datasets with re-download capability and a DICOM viewer for imaging data. There's a custom request page for when the gallery doesn't have what you need.

Oh and there's a news section with healthcare AI articles. And a pricing page with tier breakdowns. And an FAQ. Basically we built way more than we probably should have for a first version but scope creep is real and we regret nothing.

## Running it locally

```bash
git clone https://github.com/christopherjeremy/Auratral_MVP.git
cd Auratral_MVP
npm install
npm run dev
```

That'll spin up the dev server at localhost:5173. You'll need a Firebase project if you want auth to work -- drop your config in `src/firebase.js`. Without it the site still runs, just with limited functionality.

For a production build:
```bash
npm run build
```

Output lands in the `dist` folder.

## The team

Built by the founding team at Auratral Dataspace Private Limited. This repo exists for academic documentation purposes as part of our capstone project work.

## A note on the data

Every dataset in this MVP is synthetically generated. No real patient information. No actual clinical records. The schemas are realistic and the records are plausible but none of it came from a real hospital or clinic. We take data ethics seriously -- that's kind of the whole point of building this thing.

## Where this is going

The form infrastructure is partially wired up. Some forms save to Firestore, others are still frontend-only. Email notifications, admin reporting, and real payment integration are on the roadmap. We're also looking at Firebase Extensions for automated email triggers and possibly a proper admin dashboard down the line.

For now though, this is the MVP. It works, it looks good, and it demonstrates the core concept. That's enough for today.

---

Built in Bangalore. Powered by too much coffee and not enough sleep.
