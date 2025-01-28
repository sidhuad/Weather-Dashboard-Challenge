import  { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  // name: string;
  lat: number;
  lon: number;
  // country: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  
  private baseURL?: string;

  private apiKey?: string;

  // private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }
  // * Note: The following methods are here as a guide, but you are welcome to provide your own solution.
  // * Just keep in mind the getWeatherForCity method is being called in your
  // * 09-Servers-and-APIs/02-Challenge/Develop/server/src/routes/api/weatherRoutes.ts file
  
  // * the array of Weather objects you are returning ultimately goes to
  // * 09-Servers-and-APIs/02-Challenge/Develop/client/src/main.ts

  // TODO: Create fetchLocationData method
  private async fetchWeatherData(query: string) {
    // query here is the api url with api key from destructureLocationData() method
    const response = await fetch(query);
    try {
      
      if (response.ok) {
        // const weatherData = await response.json();
        return await response.json();
      }

    }catch (error) {
      console.error(error);
    }
  }


  // TODO: Create destructureLocationData method
  private async destructureLocationData(locationData: Coordinates):Promise<Weather[]> {

    // destructuring coord obj
    const {lat,lon}:Coordinates = locationData;

    // url for 5 day forecast
    const forecastUrl = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
    
    const data = await this.fetchWeatherData(forecastUrl);
    return this.parseForecastWeather(data);
  }
 
 
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(data:any):Weather[] {
    try {
      
      const city = data.name;
      const date = new Date(data.dt * 1000).toISOString().split('T')[0];
      const tempF = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
    
      const currentWeatherDataArray:Weather[] = []
      
      
      const currentWeatherForecast:Weather = {
        city,
        date,
        tempF,
        windSpeed,
        humidity,
        icon,
        iconDescription
      }
      
      currentWeatherDataArray.push(currentWeatherForecast);
      console.log(date);
      
      return currentWeatherDataArray;
      // console.log(currentWeatherDataArray);

    } catch (error) {
      console.error(error);
      return [];
    }
  }


  // TODO: Build parseCurrentWeather method
  private parseForecastWeather(data: any):Weather[] {

    try {

      const city =  data.city.name;
      const forecastWeatherDataArray:Weather[] = [];

      // with i = 2; 5 day forecast is displayed for noon
      for (let i = 3; i < data.cnt; i=i+8) {
        const tempF = data.list[i].main.temp;
        const humidity = data.list[i].main.humidity;
        const date = data.list[i].dt_txt.split(' ')[0];
        const icon = data.list[i].weather[0].icon;
        const iconDescription = data.list[i].weather[0].description;
        const windSpeed = data.list[i].wind.speed;

        // console.log(`weather for ${date}`);
        // console.log(`temp: ${temp}, humidity: ${humidity}, icon:${icon}, description:${desc}, wind speed:${speed}`);
        // console.log(`--------------------------------------`);

        const forecastWeatherData:Weather = {

          city,
          date,
          tempF,
          windSpeed,
          humidity,
          icon,
          iconDescription
          
        }
        forecastWeatherDataArray.push(forecastWeatherData);
      }
      // console.log(forecastWeatherDataArray);
      // console.log(data.city.name);
      return forecastWeatherDataArray; 
      
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string):Promise<Weather[]> {

    const response = await fetch(`${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=imperial`)

    if (response.ok) {
      
      const data = await response.json();
      
      // coord obj for 5 day foroecast: it requires coordinates rather than city name
      const coord = {
        // name:city,
        lat: data.coord.lat,
        lon: data.coord.lon,
      }
      
      // passing in coord as an coordinate object for destructuring.
      const forecastWeatherArray = await this.destructureLocationData(coord);
      const currentWeatherArray = this.parseCurrentWeather(data);

      const weatherArray = [...currentWeatherArray, ...forecastWeatherArray];

      // console.log(weatherArray);
      // console.log(`--------------------`);
      
      
      return weatherArray;

    }else{
      console.error("Weather Api is down or wrong city name");
      return [];
    }
  }
}

export default new WeatherService();
