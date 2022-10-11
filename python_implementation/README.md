# Python gRPC Implementation

This directory contains the Python implementation of the gRPC service.

## Prerequisites

-   Python 3.6+
-   gRPC
-   Protocol Buffers

## Getting Started

1.  Navigate to this directory: `cd python_implementation`
2.  Create a virtual environment: `python3 -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Run the server: `python server/greeter_server.py`
6.  In a separate terminal, run the client: `python client/greeter_client.py`

## Project Structure

```
python_implementation/
├── server/
│   └── greeter_server.py
├── client/
│   └── greeter_client.py
├── protos/
│   └── greeter.proto
└── README.md
```

## Contributing

Contributions are welcome! Please submit a pull request with your changes.
