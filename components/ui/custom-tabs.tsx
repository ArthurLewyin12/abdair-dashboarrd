import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "cards";
  size?: "sm" | "md" | "lg";
  renderTabsOnly?: boolean;
  activeTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  className,
  onTabChange,
  variant = "default",
  size = "md",
  renderTabsOnly = false,
  activeTab: externalActiveTab,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || items[0]?.id,
  );
  const activeTab = externalActiveTab || internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!externalActiveTab) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const getTabStyles = () => {
    const baseStyles =
      "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer";

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return cn(baseStyles, sizeStyles[size]);
  };

  const activeTabItem = items.find((item) => item.id === activeTab);

  const tabsComponent = (
    <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-full w-fit">
      {items.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => handleTabChange(item.id)}
          className={cn(
            getTabStyles(),
            "rounded-full",
            activeTab === item.id
              ? "bg-white text-gray-900 shadow-sm"
              : "bg-gray-100 text-gray-600 hover:text-gray-900",
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          layout
        >
          {/* Arrière-plan animé pour l'onglet actif */}
          {activeTab === item.id && (
            <motion.div
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              layoutId="activeTabBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}

          {/* Contenu de l'onglet */}
          <div className="relative z-10 flex items-center gap-2">
            {item.icon && <span>{item.icon}</span>}
            <span className="font-urbanist font-semibold whitespace-nowrap">
              {item.label}
            </span>
            {item.badge && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );

  if (renderTabsOnly) {
    return tabsComponent;
  }

  return (
    <div className={cn("w-full", className)}>
      {tabsComponent}

      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="w-full"
          >
            {activeTabItem?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
