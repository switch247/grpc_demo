
from concurrent import futures
import time

import grpc
import python_implementation.protos.greeter_pb2 as greeter_pb2
import python_implementation.protos.greeter_pb2_grpc as greeter_pb2_grpc




class Greeter(greeter_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        print("SayHello Request Made:")
        print(request)
        hello_reply = greeter_pb2.HelloReply()
        hello_reply.message = f"{request.greeting} {request.name}"

        return hello_reply
    
    def ServerSaysHello(self, request, context):
        print("ServerSaysHello Request Made:")
        print(request)

        for i in range(3):
            hello_reply = greeter_pb2.HelloReply()
            hello_reply.message = f"{request.greeting} {request.name} {i + 1}"
            yield hello_reply
            time.sleep(3)

    def ClientSaysHello(self, request_iterator, context):
        delayed_reply = greeter_pb2.DelayedReply()
        messages = []

        for request in request_iterator:
            print("ClientSaysHello Request Made:")
            print(request)
            messages.append(request.name)

            # delayed_reply.request.append(request)

        delayed_reply.message = f"You have sent {len(messages)} messages: {', '.join(messages)}. Please expect a delayed response."
        return delayed_reply

    def HybridHello(self, request_iterator, context):
        for request in request_iterator:
            print("HybridHello Request Made:")
            print(request)

            hello_reply = greeter_pb2.HelloReply()
            hello_reply.message = f"{request.greeting} {request.name}"

            yield hello_reply


_ONE_DAY_IN_SECONDS = 60 * 60 * 24
def serve():
    port = 50051
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    greeter_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    server.add_insecure_port(f'[::]:{port}')
    print(f'server is running on: {port} ')
    server.start()  
    server.wait_for_termination()

    # try:
    #     while True:
    #         print(f'server is running on: {port} ')
    #         time.sleep(_ONE_DAY_IN_SECONDS)
    # except KeyboardInterrupt:
    #     server.stop(0)

if __name__ == "__main__":
    serve()
