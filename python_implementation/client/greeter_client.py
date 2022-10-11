import sys
import os

# Add the path to the generated protobuf code
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import protos.greeter_pb2_grpc as greeter_pb2_grpc
import protos.greeter_pb2 as greeter_pb2
import time
import grpc

def get_client_stream_requests():
    while True:
        name = input("Please enter a name (or nothing to stop chatting): ")

        if name == "":
            break

        hello_request = greeter_pb2.HelloRequest(greeting = "Hello", name = name)
        yield hello_request
        time.sleep(1)

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = greeter_pb2_grpc.GreeterStub(channel)
        print("1. SayHello - Unary")
        print("2. ServerSaysHello - Server Side Streaming")
        print("3. ClientSaysHello - Client Side Streaming")
        print("4. HybridHello - Both Streaming")
        rpc_call = input("Which rpc would you like to make: ")

        if rpc_call == "1":
            hello_request = greeter_pb2.HelloRequest(greeting = "herro", name = "switch")
            hello_reply = stub.SayHello(hello_request)
            print("SayHello Response Received:")
            print(hello_reply)
        elif rpc_call == "2":
            hello_request = greeter_pb2.HelloRequest(greeting = "herro", name = "scream reference")
            hello_replies = stub.ServerSaysHello(hello_request)

            for hello_reply in hello_replies:
                print("ServerSaysHello Response Received:")
                print(hello_reply)
        elif rpc_call == "3":
            delayed_reply = stub.ClientSaysHello(get_client_stream_requests())

            print("ClientSaysHello Response Received:")
            print(delayed_reply)
        elif rpc_call == "4":
            responses = stub.HybridHello(get_client_stream_requests())

            for response in responses:
                print("HybridHello Response Received: ")
                print(response)

if __name__ == "__main__":
    run()