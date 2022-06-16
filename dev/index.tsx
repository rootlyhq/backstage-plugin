import { createDevApp } from '@backstage/dev-utils';
import { RootlyPlugin } from '../src/plugin';

createDevApp().registerPlugin(RootlyPlugin).render();
