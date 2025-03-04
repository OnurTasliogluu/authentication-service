docker exec -it <mongodb-container-id> mongosh

```bash
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongodb:27017" }
    ]
  });

  rs.status();
```