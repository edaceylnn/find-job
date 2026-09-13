# Deployment Checklist

## Environment

- `server/.env` contains `MONGODB_URL`, `JWT_SECRET_KEY`, `CLIENT_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `PORT`.
- `client/.env` contains `VITE_API_URL`, `VITE_CLOUDINARY_CLOUD_NAME`, and `VITE_CLOUDINARY_UPLOAD_PRESET`.
- `CLIENT_URL` matches the deployed frontend domain.
- `VITE_API_URL` points to the deployed backend `/api-v1` URL.
- The Cloudinary unsigned upload preset allows the resource types used by the app. CV uploads require raw file support.
- The Resend sender address is verified for production mail delivery.

## Preflight

Run from the repository root:

```bash
npm run check
```

This runs the frontend linter, production frontend build, and backend test suite.

## Backend

- Confirm MongoDB network access allows the backend host.
- Confirm `JWT_SECRET_KEY` is a strong production secret.
- Confirm `/api-v1/health` returns a successful response after deploy.
- Review provider logs for Resend or Cloudinary upload failures after the first real account/profile flow.

## Frontend

- Confirm the deployed app can log in as both a seeker and a company.
- Confirm profile image upload works.
- Confirm CV upload works when testing a seeker profile.
- Confirm job search, job application, saved jobs, and application status update flows.

## Release Smoke Test

1. Register or log in as a company.
2. Complete the company profile.
3. Publish a job.
4. Register or log in as a seeker.
5. Complete the seeker profile and upload a CV.
6. Apply to the job and save it.
7. Log back in as the company and update the application status.
