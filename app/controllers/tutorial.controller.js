import db from '../models';
import { getPagination, getPagingData } from '../helper/helper';

const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
	if (!req.body.title) {
		res.status(400).send({
			message: 'Content cannot be empty'
		});
		return;
	}

	let { title, description, published } = req.body;

	const tutorial = {
		title,
		description,
		published
	};

	Tutorial.create(tutorial)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Error Occured while creating tutorial'
			});
		});
};

exports.findAll = (req, res) => {
	const { page, size, title } = req.query;
	let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

	const { limit, offset } = getPagination(page, size);

	Tutorial.findAndCountAll({ where: condition, limit, offset })
		.then((data) => {
			const response = getPagingData(data, page, limit);
			res.send(response);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving tutorials.'
			});
		});
};

exports.findOne = (req, res) => {
	const { id } = req.params;

	Tutorial.findByPk(id)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || `Error Occured while retrieving tutorial with id = ${id}`
			});
		});
};

exports.update = (req, res) => {
	const { id } = req.params;

	Tutorial.update(req.body, {
		where: { id }
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'Tutorial was updated successfully.'
				});
			} else {
				res.send({
					message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating Tutorial with id=' + id
			});
		});
};

exports.delete = (req, res) => {
	const { id } = req.params;

	Tutorial.destroy({
		where: { id }
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'Tutorial was deleted successfully!'
				});
			} else {
				res.send({
					message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: `Could not delete Tutorial with id= ${id}`
			});
		});
};

exports.deleteAll = (req, res) => {
	Tutorial.destroy({
		where: {},
		truncate: false
	})
		.then((nums) => {
			res.send({ message: `${nums} Tutorials were deleted successfully!` });
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while removing all tutorials.'
			});
		});
};

exports.findAllPublished = (req, res) => {
	const { page, size } = req.query;
	const { limit, offset } = getPagination(page, size);

	Tutorial.findAndCountAll({ where: { published: true }, limit, offset })
		.then((data) => {
			const response = getPagingData(data, page, limit);
			res.send(response);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving tutorials.'
			});
		});
};
