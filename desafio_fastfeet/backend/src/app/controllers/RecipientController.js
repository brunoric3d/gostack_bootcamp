import Recipient from '../models/Recipient';

class RecipientController {
  // Method for recipient creation
  async store(req, res) {
    // Check if recipient name already exists in DB
    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res
        .status(400)
        .json({ error: 'Recipient with same name already registered' });
    }
    // Creates recipient and return json
    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postalcode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postalcode,
    });
  }

  // Method for recipient data update
  async update(req, res) {
    const { recipientId } = req.params;
    const { name } = req.body;

    const recipient = await Recipient.findByPk(recipientId);

    if (name && name !== recipient.name) {
      // Check if name already exists in DB
      const recipientExists = await Recipient.findOne({
        where: { name },
      });

      if (recipientExists) {
        return res
          .status(400)
          .json({ error: 'Recipient with same name already registered' });
      }
    }

    const {
      id,
      street,
      number,
      complement,
      state,
      city,
      postalcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postalcode,
    });
  }
}

export default new RecipientController();
