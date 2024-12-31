export type Color = {
	r: number;
	g: number;
	b: number;
};

export type Camera = {
	x: number;
	y: number;
	zoom: number;
};

export enum LayerType {
	Rectangle,
	Ellipse,
	Path,
	Text,
}

export type RectangleLayer = {
	type: LayerType.Rectangle;
	x: number;
	y: number;
	width: number;
	height: number;
	fill: Color;
	stroke: Color;
	opacity: number;
	cornerRadius?: number;
};

export type EllipseLayer = {
	type: LayerType.Ellipse;
	x: number;
	y: number;
	width: number;
	height: number;
	fill: Color;
	stroke: Color;
	opacity: number;
};

export type PathLayer = {
	type: LayerType.Path;
	x: number;
	y: number;
	width: number;
	height: number;
	fill: Color;
	stroke: Color;
	opacity: number;
	points: number[][];
};

export type TextLayer = {
	type: LayerType.Text;
	x: number;
	y: number;
	width: number;
	height: number;
	text: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: number;
	fill: Color;
	stroke: Color;
	opacity: number;
};

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer;

export type Point = {
	x: number;
	y: number;
};

export type XYWH = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export enum Side {
	Top = 1,
	Bottom = 2,
	Left = 4,
	Right = 8,
}

export type CanvasStates =
	| {
			mode: CanvasMode.None;
	  }
	| {
			mode: CanvasMode.Dragging;
			origin: Point | null;
	  }
	| {
			mode: CanvasMode.Inserting;
			layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text;
	  }
	| {
			mode: CanvasMode.Pencil;
	  }
	| {
			mode: CanvasMode.Resizing;
			initialBounds: XYWH;
			corner: Side;
	  }
	| {
			mode: CanvasMode.Translating;
			current: Point;
	  }
	| {
			mode: CanvasMode.SelectionNet;
			origin: Point;
			current?: Point;
	  }
	| {
			mode: CanvasMode.Pressing;
			origin: Point;
	  }
	| {
			mode: CanvasMode.RightClick;
	  };

export enum CanvasMode {
	None,
	Dragging,
	Inserting,
	Pencil,
	Resizing,
	Translating,
	SelectionNet,
	Pressing,
	RightClick,
}
