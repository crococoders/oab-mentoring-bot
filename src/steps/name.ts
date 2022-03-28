const nameStep = async (ctx: any) => {
  await ctx.reply('Введи своё имя');
  return ctx.wizard.next();
};

export { nameStep };
