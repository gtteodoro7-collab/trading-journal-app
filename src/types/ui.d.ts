// Provide permissive `any` typings for local UI primitives to satisfy VS Code
// diagnostics while keeping runtime behavior unchanged.
declare module "../components/ui/button" {
  const Button: any;
  export { Button };
  export default Button;
}

declare module "../components/ui/popover" {
  const Popover: any;
  const PopoverTrigger: any;
  const PopoverContent: any;
  export { Popover, PopoverTrigger, PopoverContent };
  export default Popover;
}

declare module "../components/ui/card" {
  const Card: any;
  const CardHeader: any;
  const CardTitle: any;
  const CardContent: any;
  export { Card, CardHeader, CardTitle, CardContent };
  export default Card;
}

declare module "../components/ui/tabs" {
  const Tabs: any;
  const TabsList: any;
  const TabsTrigger: any;
  const TabsContent: any;
  export { Tabs, TabsList, TabsTrigger, TabsContent };
  export default Tabs;
}

declare module "../components/ui/avatar" {
  const Avatar: any;
  const AvatarImage: any;
  const AvatarFallback: any;
  export { Avatar, AvatarImage, AvatarFallback };
  export default Avatar;
}

declare module "../components/ui/alert-dialog" {
  const AlertDialog: any;
  const AlertDialogAction: any;
  const AlertDialogCancel: any;
  const AlertDialogContent: any;
  const AlertDialogDescription: any;
  const AlertDialogFooter: any;
  const AlertDialogHeader: any;
  const AlertDialogTitle: any;
  export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle };
  export default AlertDialog;
}

// Broad wildcard to catch other ui modules imported with similar paths.
declare module "../components/ui/*" {
  const AnyComp: any;
  export default AnyComp;
}

// Also provide declarations for imports that include the `src/` prefix.
declare module "src/components/ui/*" {
  const AnyComp: any;
  export default AnyComp;
}
