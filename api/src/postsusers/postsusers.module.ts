import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostsUsersController } from "./postsusers.controller";
import { PostsUsers } from "./postsusers.model";
import { PostsUsersService } from "./postsusers.service";


@Module({
  imports: [SequelizeModule.forFeature([PostsUsers])],
  providers: [PostsUsersService],
  controllers: [PostsUsersController],
})
export class PostsUsersModule {}
