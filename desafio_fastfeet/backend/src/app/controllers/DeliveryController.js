import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import ShipmentInfoEmail from '../jobs/ShipmentInfoEmail';
import CancellationMail from '../jobs/CancellationMail';

class DeliveryController {
  async index(req, res) {
    // const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll();

    return res.status(200).json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = req.body;

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    await Queue.add(ShipmentInfoEmail.key, {
      delivery,
      deliveryman,
    });

    return res.status(200).json(delivery);
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.deliveryId);

    delivery.canceled_at = new Date();

    await delivery.save();

    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    await Queue.add(CancellationMail.key, {
      delivery,
      deliveryman,
    });

    return res.status(200).json('Delivery remove sucessfully');
  }
}

export default new DeliveryController();
