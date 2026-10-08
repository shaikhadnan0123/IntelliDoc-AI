FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements-cpu.txt .

# Install CPU-only PyTorch
RUN pip install --no-cache-dir \
    --index-url https://download.pytorch.org/whl/cpu \
    torch==2.13.0

# Install the rest of the application dependencies
RUN pip install --no-cache-dir \
    --default-timeout=300 \
    --retries=10 \
    -r requirements-cpu.txt

COPY app ./app
COPY frontend ./frontend

RUN mkdir -p /app/data/documents

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]