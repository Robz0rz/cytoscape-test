import cytoscape, {
  CollectionReturnValue,
  Core,
  NodeSingular,
} from 'cytoscape';

interface Options {
  cy: Core;
  eles: CollectionReturnValue;
}

type CustomLayoutType = {
  options: Options;
  (options: Options): void;
};

function CustomLayout(this: CustomLayoutType, options: Options) {
  this.options = options;
}

CustomLayout.prototype.run = function (this: CustomLayoutType) {
  const { eles } = this.options;

  const nodes = eles.nodes();
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodes.layoutPositions(
      this,
      this.options,
      (node: NodeSingular, index: number) => {
        return {
          x: index * node.width() * 2,
          y: 0,
        };
      }
    );
    // testing with delay for async stuff
  }, 0);

  return this;
};

const register = (cy: typeof cytoscape) => {
  cy('layout', 'custom', CustomLayout);
};

export default register;
