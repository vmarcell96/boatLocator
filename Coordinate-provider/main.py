import json
import asyncio
from fastapi import FastAPI
from fastapi import Request
from fastapi import WebSocket
import csv
from os.path import exists


app = FastAPI()


# Function to convert a CSV to JSON
# Takes the file paths as arguments
def csv_to_json(csvFilePath, jsonFilePath):
     
    # create a dictionary
    jsonArray = []
     
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
         
        # Convert each row into a dictionary
        # and add it to data
        for row in csvReader:
            #add this python dict to json array
            jsonArray.append(row)
 
    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
         

def get_json_content_array(jsonFilePath):
    fileObject = open(jsonFilePath, "r")
    jsonContent = fileObject.read()
    return json.loads(jsonContent)


@app.get("/")
def read_root(request: Request):
    return "index"


@app.websocket("/ws/{line_id}")
async def websocket_endpoint(websocket: WebSocket, line_id):
    id = str(line_id)
    await websocket.accept()
    if not exists("line" + id + ".json"):
        csv_to_json("line" + id + ".csv", "line" + id + ".json")
    coords = get_json_content_array("line" + id + ".json")
    index = 0
    while True:
        # 1Hz
        await asyncio.sleep(1)
        if (index == len(coords)):
            websocket.close()
        payload = coords[index]
        index = index + 1
        await websocket.send_json(payload)
