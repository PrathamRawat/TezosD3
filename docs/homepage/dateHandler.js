now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);
now = now.getTime();

gphQuery(now - (3600000 * 168));
transactionVolumePerHourQuery(now - (3600000 * 168));
transactionsPerHourQuery(now - (3600000 * 168));
priorityZeroBlocksPerHourQuery(now - (604800000));
blocksPerHourQuery(now - (604800000));

