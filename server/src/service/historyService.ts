import fs from 'node:fs/promises';
// import { json } from 'node:stream/consumers';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read():Promise<City[]> {
    const data = await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
    return JSON.parse(data);
  }


  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]):Promise<void> {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }


  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities():Promise<City[]> {
    try {
      const cities = await this.read();
      return cities;
    } catch (error) {
      throw new Error("cannot read from file: process in historyService")
    }
  }


  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cityArray = await this.getCities();
    const newCity:City = {
      id:uuidv4(),
      name:city
    }
    cityArray.push(newCity);
    await this.write(cityArray);
  }

  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cityId = id;
    let cityArray = await this.getCities();
    cityArray = cityArray.filter(city => city.id !== cityId); // filtering the city array by checking which cities id does not match and leaving it out and keeping the rest in and writing to file again    
    this.write(cityArray);
  }
}

export default new HistoryService();
