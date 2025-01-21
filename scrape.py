import os
import sys
from bs4 import BeautifulSoup

# Function to scrape values for given IDs
def scrape_values_by_ids(file_path, ids):
    try:
        # Open and read the HTML file
        with open(file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()

        if(os.path.exists(file_path)):
            os.remove(file_path)
        
        # Parse the HTML content
        soup = BeautifulSoup(html_content, 'html.parser')

        # Dictionary to store the scraped values
        scraped_data = {}

        # Iterate over the list of IDs and extract their values
        for element_id in ids:
            element = soup.find(id=element_id)
            if element:
                scraped_data[element_id] = element.get_text(strip=True)
            else:
                scraped_data[element_id] = None  # None if the ID is not found

        # Print the scraped data
        for key, value in scraped_data.items():
            print(f"{value}")

    except FileNotFoundError:
        print(f"The file {file_path} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
file_path = sys.argv[1] + '.html'

ids = [
    'lblStudName',
    'lblHTNo',
    'lblBranch',
    'lblSem',
    'cpStudCorner_lblFinalCGPA',
    'cpStudCorner_lblCreditsObtained',
    'cpStudCorner_lblDueSubjects'
]
scrape_values_by_ids(file_path, ids)