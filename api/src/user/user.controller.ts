import { UsersService } from './user.service';
import { Body, Controller, Delete, Get, Param, Put, Post, Query } from '@nestjs/common';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(private usersService: UsersService) {}

    @Get('get-all')
    findAll() {
        return this.usersService.findAll();
    }

    @Get('get/:id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Delete('delete/:id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }

    @Put(':id/edit')
    edit(@Param('id') id: number, @Body() userDto: UserDto) {
        return this.usersService.edit(id, userDto);
    }

    @Put(':id/edit/emotion-state')
    editState(@Param('id') id: number, @Body() state: any) {
        return this.usersService.editState(id, state);
    }

    @Delete(':id/delete/emotion-state')
    removeCurrentState(@Param('id') id: number) {
        return this.usersService.removeCurrentState(id);
    }

    @Post('add-friend')
    addFriend(@Body() friend: any) {
        return this.usersService.addFriend(friend);
    }

    @Post('add-friends')
    addFriends(@Body() friends: any) {
        return this.usersService.addFriends(friends);
    }

    @Get(':id/get-friend-req-number')
    getFriendReqNumber(@Param('id') id: number) {
        return this.usersService.getFriendReqNumber(id);
    }

    @Get(':id/get-req-friends')
    getReqFriends(@Param('id') id: number) {
        return this.usersService.getReqFriends(id);
    }

    @Get(':id/get-friends')
    getAllFriends(@Param('id') id: number) {
        return this.usersService.getAllFriends(id);
    }

    @Get('get-friends-by-search')
    getFriendsBySearch(@Query('id') id: number, @Query('searchValue') searchValue: string) {
        return this.usersService.getFriendsBySearch(id, searchValue);
    }

    @Get('get-relationship')
    getRelationship(@Query('userId') userId: number, @Query('friendId') friendId: number) {
        return this.usersService.getRelationshipOfTwoUser(userId, friendId);
    }

    @Get('get-cared-tops')
    getCaredTops() {
        return this.usersService.getCaredTops();
    }

    @Delete('remove-friend')
    removeFriend(@Body() friend: any) {
        return this.usersService.removeFriend(friend);
    }
}
