import { UserEntity } from '../../users/entity/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import { TasksEntity } from '../tasks/tasks.entity';

@Entity('projects')
export class ProjectsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({ length: 20 })
    createdDate: string;

    @ManyToOne(() => UserEntity, (user) => user.projects)
    author: number;

    @OneToMany(() => TasksEntity, (task: TasksEntity) => task.project)
    tasks: number[];
}
