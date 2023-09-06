import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { OnEvent } from '@nestjs/event-emitter';
import { TasksEntity } from '../projects/tasks/tasks.entity';

@Injectable()
export class EventsService {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    emitEvent(msg: string, eventData: any) {
        this.eventEmitter.emit(msg, eventData);
    }

    @OnEvent('tasks.created')
    handleTaskCreatedEvent(eventData: TasksEntity) {
        console.log('Task created:', eventData);
    }

    @OnEvent('tasks.deleted')
    handleTaskDeletedEvent(eventData: number) {
        console.log('Task deleted id:', eventData);
    }
}