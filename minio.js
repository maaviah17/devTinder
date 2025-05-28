const Minio = require("minio");

// Create MinIO client
const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "admin",
  secretKey: "admin12345"
});

// Create a bucket if not exists
const bucketName = "my-bucket";

minioClient.bucketExists(bucketName, function(err, exists) {
  if (err) return console.log("Error checking bucket:", err);

  if (!exists) {
    minioClient.makeBucket(bucketName, "us-east-1", function(err) {
      if (err) return console.log("Bucket creation error:", err);
      console.log("✅ Bucket created successfully");
    });
  } else {
    console.log("✅ Bucket already exists");
  }
});
