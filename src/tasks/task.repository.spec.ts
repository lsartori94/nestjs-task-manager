import { Test } from "@nestjs/testing";
import { TaskRepository } from "./task.repository";
import { TaskStatus } from "./task-status.enum";
import { InternalServerErrorException } from "@nestjs/common";

const mockUser = {
  username: 'Test User',
  id: 1,
}

const tasks = [
  {
    id: 1,
    title: 'Title',
    description: 'Description',
    status: TaskStatus.OPEN,
    userId: 1,
    user: mockUser,
  },
  {
    id: 1,
    title: 'Title',
    description: 'Test',
    status: TaskStatus.OPEN,
    userId: 1,
    user: mockUser,
  },
];

const mockCreateTaskDto = {
  title: 'Title',
  description: 'Description',
}

describe('TaskRepository', () => {
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskRepository,
      ],
    }).compile();

    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    let where;
    let andWhere;
    let getMany;

    beforeEach(() => {
      where = jest.fn();
      andWhere = jest.fn();
      getMany = jest.fn();
      taskRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where,
        andWhere,
        getMany,
      });
    });

    it('should get all tasks for the current user', async () => {
      getMany.mockResolvedValue(tasks);
      expect(where).not.toHaveBeenCalled();
      expect(andWhere).not.toHaveBeenCalled();
      expect(getMany).not.toHaveBeenCalled();

      const result = await taskRepository.getTasks({}, mockUser)

      expect(where).toHaveBeenCalled();
      expect(andWhere).not.toHaveBeenCalled();
      expect(getMany).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });

    it('should get tasks for a user with an specific status', async () => {
      const mockedGetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
      };
      getMany.mockResolvedValue(tasks);
      expect(where).not.toHaveBeenCalled();
      expect(andWhere).not.toHaveBeenCalled();
      expect(getMany).not.toHaveBeenCalled();

      const result = await taskRepository.getTasks(mockedGetTaskFilterDto, mockUser)

      expect(where).toHaveBeenCalled();
      expect(andWhere).toHaveBeenCalledTimes(1);
      expect(andWhere).toHaveBeenLastCalledWith('task.status = :status', { status: TaskStatus.IN_PROGRESS });
      expect(getMany).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });

    it('should get tasks for a user with an specific search term', async () => {
      const mockedGetTaskFilterDto = {
        search: 'Test',
      };
      getMany.mockResolvedValue(tasks);
      expect(where).not.toHaveBeenCalled();
      expect(andWhere).not.toHaveBeenCalled();
      expect(getMany).not.toHaveBeenCalled();

      const result = await taskRepository.getTasks(mockedGetTaskFilterDto, mockUser)

      expect(where).toHaveBeenCalled();
      expect(andWhere).toHaveBeenCalledTimes(1);
      expect(andWhere).toHaveBeenLastCalledWith(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%Test%` }
      );
      expect(getMany).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });

    it('should throw an exception and log if something errors', async () => {
      getMany.mockRejectedValue({ stack: 'error'});
      expect(where).not.toHaveBeenCalled();
      expect(andWhere).not.toHaveBeenCalled();
      expect(getMany).not.toHaveBeenCalled();

      expect(taskRepository.getTasks({}, mockUser)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createTask', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      taskRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('should create and save a task', async () => {
      save.mockResolvedValue(tasks[0]);
      expect(taskRepository.createTask(mockCreateTaskDto, mockUser)).resolves.not.toThrow();
    });

    it('should throw an exception if something errors', () => {
      save.mockRejectedValue({ stack: ''});
      expect(taskRepository.createTask(mockCreateTaskDto, mockUser)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
