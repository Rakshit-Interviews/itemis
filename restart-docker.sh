#!/bin/bash

docker compose down
# docker system prune -a --volumes -f
docker compose up --build -d