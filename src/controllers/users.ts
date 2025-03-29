
import { deleteUserById, getUserById } from '../db/users';
import express from 'express';

export const deleteUser=async(req:express.Request,res:express.Response)=>{
    try{
        const {id}=req.params;
        const deletedUser=await deleteUserById(id);
        res.json(deletedUser);
        return;

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

export const updateUser =async (req:express.Request,res:express.Response)=>{
    try{
        const {id}=req.params;
        const {username}=req.body;
        if(!username){
            res.status(400);
            return;
        }
        const user=await getUserById(id);
        if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
}
        user.username=username;
        await user.save();
        res.sendStatus(200).json(user).end();
        return;

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}