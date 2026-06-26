import ollama
import json
import pprint

def get_models_data():
    # Fetch the list of local models
    response = ollama.list()
    
    return response

# Print names of available models
# for model in response.models:
#     print(model.model)