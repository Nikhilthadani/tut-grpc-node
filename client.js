const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const text = process.argv[4];
/** Load package def into GRPC object */
const packageDef = protoLoader.loadSync("todos.proto");
/** The complete grpc object*/
const grpcObject = grpc.loadPackageDefinition(packageDef);
/**Todos package: package todoPackage; */
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "localhost:4000",
  grpc.credentials.createInsecure()
);

// client.createTodo({ id: -1, text: "Data" + Date.now() }, (err, response) => {
//   console.log("Received response from server: ", JSON.stringify(response));
// });

// client.readTodos({}, (err, response) => {
//   console.log("Received response from server: ", JSON.stringify(response));
// });

const call = client.readTodosStream();
call.on("data", (item) => {
  console.log("Received ITEM from server: ", JSON.stringify(item));
});
call.on("end", (e) => {
  console.log("End of stream: ", JSON.stringify(e));
});
