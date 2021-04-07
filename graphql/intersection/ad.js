const { intersection } = require('lodash');

module.exports = (fields) => {
  if (fields) {
    const intersectionFields = { id: 1 };

    intersection(
      [
        'status',
        'category',
        'location',
        'title',
        'price',
        'description',
        'phone',
        'fields',
        'photos',
        'createdAt',
        'updatedAt',
        'expireAt',
      ],
      Object.keys(fields)
    ).forEach((field) => {
      intersectionFields[field] = 1;
    });

    return intersectionFields;
  } else return {};
};
