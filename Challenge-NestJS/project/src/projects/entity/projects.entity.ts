import { UserEntity } from 'src/users/entity/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';

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
    author: UserEntity
}
