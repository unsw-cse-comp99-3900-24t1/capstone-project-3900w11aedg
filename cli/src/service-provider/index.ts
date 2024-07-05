#!/usr/bin/env ts-node

import { Command } from 'commander';

const program = new Command();

program.name('service-provider').description('NSW Ivy Nightclub CLI').version('1.0.0');

program
  .command('greet <name>')
  .description('Greet a person')
  .action((name: string) => {
    console.log(`Hello from CLI 1, ${name}!`);
  });

program.parse(process.argv);
