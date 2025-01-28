import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
    try {
    // TODO: GET weather data from city name
      const cityName = req.body.cityName;
  
      WeatherService.getWeatherForCity(cityName).then((data) => {
        // TODO: save city to search history
        HistoryService.addCity(cityName);
  
        // console.log(data);
        
        res.json(data);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });
  


// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
    HistoryService.getCities()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    HistoryService.removeCity(id);
    res.sendStatus(200)
    console.log(`${id} Deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
