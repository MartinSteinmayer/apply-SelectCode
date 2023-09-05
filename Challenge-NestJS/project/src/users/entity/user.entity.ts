import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectsEntity } from '../../projects/entity/projects.entity';

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    username: string;

    @Column({ length: 500 })
    password: string;

    @OneToMany(() => ProjectsEntity, (project: ProjectsEntity) => project.author)
    projects: number[];
}
