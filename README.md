# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


# DePaul Community Health Centers - AI Patient Re-engagement System

## Overview
An AI-powered patient outreach and scheduling system that helps healthcare organizations re-engage patients who haven't visited in 6+ months.

## Features
- Smart conversational AI simulation
- Weekend/evening appointment scheduling
- Transportation and insurance assistance
- Real-time analytics dashboard
- Mobile-responsive SMS-like interface

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Navigate to `http://localhost:3000`

## Configuration
- Update clinic data in `/src/data/clinics.js`
- Modify patient scenarios in `/src/data/patients.js`
- Customize branding in `/src/components/`
