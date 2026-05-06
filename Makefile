.PHONY: data train test run-backend run-frontend clean

data:
	@echo "Fetching and processing data..."
	# python ml_engine/data/make_dataset.py

train:
	@echo "Training models..."
	# python ml_engine/models/train_model.py

test:
	@echo "Running tests..."
	pytest tests/

run-backend:
	cd backend && uvicorn main:app --reload

run-frontend:
	cd frontend && npm run dev

clean:
	@echo "Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -exec rm -rf {} +
