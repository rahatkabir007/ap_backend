import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    @Interval(180000)
    async handleInterval() {
        // axios.get("https://premium-apk-and-codes-nest-2023.onrender.com/");
        try {
            const response = await axios.get('https://art-portfolio-backend.onrender.com');
            console.log('Server Start', response.data);
        } catch (error) {
            console.log(error);
        }
        this.logger.debug('Called every 5 min');
    }

}