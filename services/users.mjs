import { models } from '../db/db.mjs';

const { UserModel } = models;

const getUserById = async (req, res) => {};

const deleteUserById = async (req, res) => {};

export default {
  getAllUsers: async function (request, response) {
    try {
      const data = await UserModel.find();
      console.log('data: ', data);
      return response.status(200).send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: 'Something went wrong... Try again later!',
      });
    }
  },
  getUserById: async function (request, response) {
    try {
      const data = await UserModel.findById(request.params.id);
      return response.status(200).send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: 'Something went wrong... Try again later!',
      });
    }
  },
  createUser: async function (request, response) {
    try {
      const data = new UserModel(request.body);
      await data.save();
      return response.status(200).send({ data });
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: 'Something went wrong... Try again later!',
      });
    }
  },
  updateUser: async function (request, response) {
    try {
      const data = await UserModel.findOneAndUpdate({
        _id: req.params.id,
      });
      return res.status(200).send({
        data: 'User was successfully updated!',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: 'Something went wrong... Try again later!',
      });
    }
  },
  deleteUserById: async function (request, response) {
    try {
      console.log(request.params.id)
      const data = await UserModel.remove({ id: request.params.id });
      console.log(data)
      return response.status(200).send({ data: "Deleted Successfully" });
    } catch (error) {
      console.log(error)
      return response.status(500).send({ message: "Technical Error" });
    }
  },
};
