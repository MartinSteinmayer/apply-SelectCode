import { UserEntity } from 'src/users/entity/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import { ProjectsEntity } from '../entity/projects.entity';

@Entity('tasks')
export class TasksEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({ length: 20 })
    createdDate: string;

    @ManyToOne(() => ProjectsEntity, (project : ProjectsEntity) => project.tasks)
    project: number;
}
