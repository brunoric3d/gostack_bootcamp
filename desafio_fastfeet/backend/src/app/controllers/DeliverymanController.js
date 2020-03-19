import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll();

    return res.json(deliverymen);
  }

  // Method for user creation
  async store(req, res) {
    // Check if email already exists in DB
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Deliveryman with same email already registered' });
    }
    // Creates deliveryman and return json
    const { id, name, avatar_id, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  // Method for user data update
  async update(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: "A deliveryman with this ID doesn't exists" });
    }

    const { name, avatar_id, email } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: "A deliveryman with this ID doesn't exists" });
    }
    await deliveryman.destroy();

    return res.status(200).json('Deliveryman removed');
  }
}

export default new DeliverymanController();
