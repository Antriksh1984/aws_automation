```markdown
# Event-Driven Data Processing & Automated Reporting Pipeline (AWS)

## Overview
This project implements a fully serverless, event-driven data processing pipeline on AWS.  
The system ingests incoming data, processes it automatically, stores it for analytics, and generates automated daily summary reports. All infrastructure is provisioned using Infrastructure as Code (IaC) and deployed via CI/CD.

The architecture follows modern cloud-native and data engineering best practices, emphasizing scalability, fault tolerance, and zero manual operations.

---

## High-Level Architecture

```

Data Producer
|
v
S3 Raw Bucket
(ObjectCreated Event)
|
v
Processing Lambda
|
v
S3 Processed Bucket
|
v
Glue Crawler → Glue Data Catalog
|
v
Athena (SQL Analytics)
|
(EventBridge Daily Schedule)
|
v
Report Lambda
|
v
S3 Reports Bucket

```

---

## Technologies Used

- Amazon S3 – Raw, processed, and report storage
- AWS Lambda – Event-driven processing and reporting
- AWS Glue – Schema discovery and metadata catalog
- Amazon Athena – Serverless SQL analytics
- Amazon EventBridge Scheduler – Automated daily reporting
- AWS SAM (CloudFormation) – Infrastructure as Code
- GitHub Actions – CI/CD pipeline
- Node.js – Lambda runtime

---

## Repository Structure

```

.
├── template.yaml           # AWS SAM infrastructure definition
├── src/
│   ├── Function2/          # Processing Lambda
│   │   └── index.js
│   └── Function/           # Report Lambda
│       └── index.js
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
├── README.md

```

---

## Data Flow Explanation

### Data Ingestion
- Data is uploaded to the Raw S3 bucket.
- S3 emits an ObjectCreated event.
- The event triggers the Processing Lambda.

### Data Processing
- The Processing Lambda reads raw data.
- Performs validation and transformation.
- Writes structured output to the Processed S3 bucket.

### Metadata and Analytics
- AWS Glue Crawler scans processed data.
- Schema is stored in the Glue Data Catalog.
- Data becomes queryable via Amazon Athena.

### Automated Reporting
- EventBridge Scheduler triggers the Report Lambda daily.
- The Report Lambda runs Athena queries.
- Aggregates daily metrics.
- Stores reports in the Reports S3 bucket.

---

## Infrastructure as Code

All AWS resources are provisioned using AWS SAM, including:
- Encrypted S3 buckets with public access blocked
- Lambda functions with IAM roles
- Event triggers (S3 and EventBridge)
- Glue Database and Crawler
- Athena WorkGroup
- CloudWatch Log Groups

This ensures repeatable, auditable, and version-controlled infrastructure.

---

## CI/CD Pipeline

The project supports Continuous Integration and Continuous Deployment using GitHub Actions.

Pipeline flow:
1. Code is pushed to the main branch.
2. GitHub Actions workflow is triggered automatically.
3. SAM template is validated.
4. Lambda functions are built.
5. Infrastructure and code are deployed to AWS.

No manual AWS Console interaction is required.

---

## Security Considerations

- All S3 buckets enforce encryption using AWS KMS.
- Public access is fully blocked.
- TLS-only access is enforced via bucket policies.
- IAM roles follow the principle of least privilege.
- CloudWatch logging is enabled for observability.

---

## Scalability and Fault Tolerance

### Scalability
- AWS Lambda automatically scales with incoming events.
- Amazon S3 supports virtually unlimited throughput.
- Amazon Athena scales automatically for large datasets.

### Fault Tolerance
- Lambda retries on transient failures.
- Raw data is preserved for reprocessing.
- Glue handles schema evolution.
- Logs are retained for debugging and auditing.

---

## Design Principles

- Event-driven architecture
- Serverless-first approach
- Separation of raw and processed data
- Fully automated workflows
- No server management

---

Just tell me what to do next.
