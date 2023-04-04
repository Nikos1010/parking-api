export const notFoundData = (data) => {
  if (!data) data = [];

  const content = !data.length ? [{ error: "Not data Found" }] : data;

  const statusCode = !data.length ? 404 : 200;

  return { content, statusCode };
};
