const { AthenaClient, StartQueryExecutionCommand, GetQueryExecutionCommand, GetQueryResultsCommand } = require("@aws-sdk/client-athena");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const athena = new AthenaClient();
const s3 = new S3Client();

exports.handler = async () => {
  const yesterday = new Date(Date.now() - 86400000);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, '0');
  const d = String(yesterday.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;

  const query = `
    SELECT COUNT(*) AS record_count
    FROM your_table_name  -- REPLACE after crawler runs
    WHERE year = ${y} AND month = ${m} AND day = ${d}
  `;

  const { QueryExecutionId } = await athena.send(new StartQueryExecutionCommand({
    QueryString: query,
    WorkGroup: "data-wg",
    ResultConfiguration: { OutputLocation: `s3://${process.env.REPORTS_BUCKET_NAME}/temp/` }
  }));

  let state = "RUNNING";
  while (state === "RUNNING" || state === "QUEUED") {
    await new Promise(r => setTimeout(r, 3000));
    const { QueryExecution: { Status: { State: state } } } = await athena.send(new GetQueryExecutionCommand({ QueryExecutionId }));
  }

  if (state !== "SUCCEEDED") throw new Error("Query failed");

  const { ResultSet } = await athena.send(new GetQueryResultsCommand({ QueryExecutionId }));
  const csv = ResultSet.Rows.map(row => row.Data.map(c => c.VarCharValue || "").join(",")).join("\n");

  await s3.send(new PutObjectCommand({
    Bucket: process.env.REPORTS_BUCKET_NAME,
    Key: `daily-report-${dateStr}.csv`,
    Body: csv,
    ContentType: "text/csv"
  }));
};
