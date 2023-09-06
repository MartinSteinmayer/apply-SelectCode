import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from 'eventemitter2';
import { EventsService } from './events.service';
import { TasksEntity } from 'src/projects/tasks/tasks.entity';
import { Console } from 'console';

describe('EventsService', () => {
  let eventsService: EventsService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: Console,
          useValue: {
            log: jest.fn(),
          },
        }
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('emitEvent', () => {
    it('should emit an event with the provided message and data', () => {
      const message = 'test.event';
      const eventData = { some: 'data' };

      eventsService.emitEvent(message, eventData);

      expect(eventEmitter.emit).toHaveBeenCalledWith(message, eventData);
    });
  });

  describe('handleTaskCreatedEvent', () => {
    it('should log a message when a task is created', () => {
      const taskData : TasksEntity = { name: 'Task 1', description: 'Description 1', createdDate: new Date().toDateString(), project: 1, id: 1 };

      const consoleSpy = jest.spyOn(console, 'log');

      eventsService.handleTaskCreatedEvent(taskData);


      expect(consoleSpy).toHaveBeenCalledWith('Task created:', taskData);
      consoleSpy.mockRestore();
    });
  });

  describe('handleTaskDeletedEvent', () => {
    it('should log a message when a task is deleted', () => {
      const taskData : TasksEntity = { name: 'Task 1', description: 'Description 1', createdDate: new Date().toDateString(), project: 1, id: 1 };

      const consoleSpy = jest.spyOn(console, 'log');

      eventsService.handleTaskDeletedEvent(taskData.id);

      expect(consoleSpy).toHaveBeenCalledWith('Task deleted id:', taskData.id);
      consoleSpy.mockRestore();
    });
  });
});
