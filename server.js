const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

/** Load package def into GRPC object */
const packageDef = protoLoader.loadSync("todos.proto");
/** The complete grpc object*/
const grpcObject = grpc.loadPackageDefinition(packageDef);
/**Todos package: package todoPackage; */
const todoPackage = grpcObject.todoPackage;

/**The server of GRPC - HTTP/2 by default needs credentialds hence we create insecure creds for now*/
const server = new grpc.Server();
server.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.log(err);
      throw new Error("App not started");
    } else {
      console.log("App listening on PORT", port);
    }
  }
);

server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream,
});

const TODOS = [{ id: 1, text: "DUMMY" }];
/**
 * @param call The call that made: Not the actual request. You got access to whole thing
 * @param callback The response you need to send to client. The client listens to this function
 */
function createTodo(call, callback) {
  console.log("in createTodo");
  const todoItem = {
    id: TODOS.length + 1,
    text: call.request.text,
  };
  TODOS.push(todoItem);
  console.log(TODOS);

  callback(null, todoItem);
}
/**IMPORTANT: SEND RESPONSE AS PER SCHEMA!!!!!!!!!!!! */
function readTodos(call, callback) {
  callback(null, { todoItems: TODOS });
}

function readTodosStream(call, callback) {
  TODOS.forEach((t) => call.write(t));
  call.end();
}
