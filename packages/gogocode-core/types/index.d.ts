declare module 'gogocode' {
  import * as t from '@babel/types';
  import ASTNode = t.Node;
  namespace GoGoCode {
    interface GoGoOption {
      /** 基本与babel/parse的options一致，唯一区别是解析html时需要定义为{html: true} */
      parseOptions?: any;
      /** 需要插入到代码中的ast节点的映射	 */
      astFragment?: any;
    }

    interface FindOption {
      /**
       * 匹配时是否忽略顺序
       * 忽略顺序的情况：{a:$_$}匹配{b:1, a:2}
       * 需要严格按照顺序匹配的情况：function($_$, b){} 匹配function(a, b){}
       * 默认为 false
       */
      ignoreSequence?: boolean;
      /** 基本与babel/parse的options一致，唯一区别是解析html时需要定义为{html: true} */
      parseOptions?: any;
    }

    type MatchResult = Array<
      Array<{
        structure: ASTNode;
        value: string;
      }>
    >;
    type NodeAndString = string | ASTNode;
    type Selector = NodeAndString;
    type Replacer = NodeAndString;

    interface NodePath {
      node: ASTNode;
      parent: any;
      parentPath: NodePath;
      value: string;
    }

    interface GoGoAST {
      /** ast节点及路径 */
      nodePath: NodePath;
      /** 基本与babel/parse的options一致，唯一区别是解析html时需要定义为{html: true} */
      parseOptions?: any;
      /** 完整节点中被通配符匹配到的节点 */
      match: MatchResult;
      /** 获取AST实例上的第一个ast节点 */
      node: ASTNode;
      /**
       * 根据代码选择器选中AST节点
       * @param selector 代码选择器，可以是代码也可以将代码中的部分内容挖空替换为通配符
       * @param options
       */
      find(selector: Selector, options?: FindOption): GoGoAST;
      /**
       * 获取某个父节点
       * @param level 自内向外第n层父元素，默认值 0
       */
      parent(level: number): GoGoAST;
      /**
       * 获取所有父节点
       */
      parents(): GoGoAST;
      /**
       * 获取根节点
       */
      root(): GoGoAST;
      /**
       * 获取所有兄弟节点
       */
      siblings(): GoGoAST;
      /**
       * 获取前一个节点
       */
      prev(): GoGoAST;
      /**
       * 获取当前节点之前的同级节点
       */
      prevAll(): GoGoAST;
      /**
       * 获取后一个节点
       */
      next(): GoGoAST;
      /**
       * 获取当前节点之后的同级节点
       */
      nextAll(): GoGoAST;
      /**
       * 遍历集合里的每一个节点
       * @param callback 	对于每个匹配的元素所要执行的函数，执行函数时，会给函数传递当前节点node和index
       */
      each(callback: (node: GoGoAST, index: number) => void): GoGoAST;
      /**
       * 获取当前集合中第N个AST对象
       * @param index 需要获取的AST对象的位置，默认值 0
       */
      eq(index: number): GoGoAST;

      /************** 以下为操作节点的方法 **************/

      /**
       * 返回属性名称对应的节点或属性值
       * @param attrPath ast节点的属性名称，支持多层属性，通过 . 连接
       */
      attr(attrPath: string): ASTNode;

      /**
       * 修改属性名称对应的节点或属性值
       * @param attrPath ast节点的属性名称，支持多层属性，通过 . 连接
       * @param attrValue 将第一个入参获取到的节点或属性修改为该入参。注意：字符串不会被解析为ast节点而是直接替换原有属性
       */
      attr(attrPath: string, attrValue: ASTNode | string): GoGoAST;

      /**
       * 修改多个属性名称对应的节点或属性值
       * @param attrMap { attrPath: attrValue }
       */
      attr(attrMap: { [k: string]: ASTNode | string }): GoGoAST;
      /**
       * 判断是否有某个子节点
       * @param selector 代码选择器，可以是代码也可以将代码中的部分内容挖空替换为通配符
       * @param options
       */
      has(selector: Selector, options: FindOption): boolean;
      /**
       * 返回由当前节点深度复制的新节点
       */
      clone(): GoGoAST;
      /**
       * 在当前节点内部用replacer替换selector匹配到的代码，返回当前节点
       * @param selector 代码选择器，可以是代码也可以将代码中的部分内容挖空替换为通配符
       * @param replacer 用来替换的代码，可以用通配符填空。也可以是AST节点
       */
      replace(selector: Selector, replacer: Replacer): GoGoAST;
      /**
       * 在当前节点内部用replacer替换selector匹配到的代码，返回当前节点
       * @param selector 代码选择器，可以是代码也可以将代码中的部分内容挖空替换为通配符
       * @param replacer 替换函数，传入 match 作为参数，返回用来替换的字符串
       */
      replace(
        selector: Selector,
        replacer: (match: MatchResult, nodePath: NodePath) => string
      ): GoGoAST;
      /**
       * 用replacerAST替换当前节点，返回新节点
       * @param replacer 用来替换的代码，也可以是AST节点
       */
      replaceBy(replacer: Replacer): GoGoAST;
      /**
       * 在当前节点后面插入一个同级别的节点，返回当前节点
       * @param ast 代码字符串或者AST节点
       */
      after(ast: NodeAndString): GoGoAST;
      /**
       * 在当前节点前面插入一个同级别的节点，返回当前节点
       * @param ast 代码字符串或者AST节点
       */
      before(ast: NodeAndString): GoGoAST;
      /**
       * 在当前节点内部某个数组属性的末尾插入一个子节点，返回当前节点
       * @param attrm 当前节点的数组属性名称
       * @param ast 当前节点的数组属性名称
       * AST.find('function $_$() {}').append('params', 'b')
       */
      append(attr: string, ast: NodeAndString): GoGoAST;
      /**
       * 在当前节点内部某个数组属性的末尾插入一个子节点，返回当前节点
       * @param attrm 当前节点的数组属性名称
       * @param ast 当前节点的数组属性名称
       * AST.find('function $_$() {}').prepend('body', 'b = b || 1;')
       */
      prepend(attr: string, ast: NodeAndString): GoGoAST;
      /**
       * 清空当前节点所有子节点，返回当前节点
       */
      empty(): GoGoAST;
      /**
       * 移除当前节点，返回根节点
       */
      remove(): GoGoAST;
      /**
       * 将AST对象输出为代码
       */
      generate(): string;
    }

    interface $ {
      (code: string, options?: GoGoOption): GoGoAST;
      loadFile(path: string, options: GoGoOption): GoGoAST;
      writeFile(code: string, filename: string);
    }
  }
  const $: GoGoCode.$;
  export = $;
}
