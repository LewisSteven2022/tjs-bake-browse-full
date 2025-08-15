# 📚 TJ's Bake & Browse - Documentation Hub

## 🎯 **Quick Navigation**

| Document                               | Purpose                                          | Audience          |
| -------------------------------------- | ------------------------------------------------ | ----------------- |
| [📝 Todos](./todos.md)                 | Current development priorities and task tracking | Developers        |
| [📊 Data Models](./data-models.md)     | Database schemas and API reference               | Developers        |
| [🔧 Tech Guide](./tech-guide.md)       | Complete technical flow documentation            | Developers        |
| [🚀 Enhancements](./enhancements.md)   | Future feature ideas and roadmap                 | Product Team      |
| [👥 User Guide](./user-guide.md)       | Client-facing operational instructions           | Business Users    |
| [🐛 Bug Tracking](./bugs.md)           | Known issues and resolution log                  | All Teams         |
| [🚀 Deployment](./deployment-guide.md) | Production deployment procedures                 | DevOps/Developers |

## 📖 **Documentation Overview**

### **For Business Users**

- **[User Guide](./user-guide.md)**: How to manage products, prices, orders, and daily operations
- **[Enhancement Ideas](./enhancements.md)**: Future feature possibilities and business improvements
- **[Bug Tracking](./bugs.md)**: Report issues and track resolution status

### **For Developers**

- **[Data Models](./data-models.md)**: Complete database schema and API documentation
- **[Tech Guide](./tech-guide.md)**: Complete technical flow and troubleshooting guide
- **[Deployment Guide](./deployment-guide.md)**: Step-by-step production deployment
- **[Todos](./todos.md)**: Active development tasks and priorities
- **[Bug Tracking](./bugs.md)**: Technical issue resolution and prevention

### **For Product Management**

- **[Todos](./todos.md)**: Development roadmap and current priorities
- **[Enhancement Ideas](./enhancements.md)**: Feature backlog and future planning
- **[User Guide](./user-guide.md)**: Current platform capabilities

## 🏗️ **Project Architecture**

**TJ's Bake & Browse** is a Next.js-based click & collect e-commerce platform for a Jersey-based bakery business.

### **Technology Stack**

- **Frontend**: Next.js 14.2.5, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Testing**: Vitest
- **Deployment**: Vercel (recommended)

### **Key Features**

- Product catalogue with category browsing
- Shopping cart with localStorage persistence
- Order placement with pickup time scheduling
- Admin dashboard for inventory and order management
- Role-based access control
- Responsive mobile-first design

## 📋 **Project Status**

- **Current Version**: 2.0.0
- **Status**: Active Development
- **Last Major Update**: Database schema overhaul (Aug 2025)
- **Next Milestone**: UI modernisation and cart persistence

## 🔄 **Documentation Maintenance**

### **Update Schedule**

- **Daily**: [Todos](./todos.md) as tasks progress
- **Weekly**: [Bug Tracking](./bugs.md) during team reviews
- **Monthly**: [Enhancement Ideas](./enhancements.md) during planning
- **Quarterly**: [User Guide](./user-guide.md) and [Deployment Guide](./deployment-guide.md)

### **Contribution Guidelines**

1. Update relevant docs when making code changes
2. Keep technical accuracy as the top priority
3. Use clear, concise language for business users
4. Include examples and step-by-step instructions
5. Cross-reference related documents

## 🤖 **AI Agent System**

This project uses specialised AI agents for development tasks. Each agent has specific expertise and responsibilities:

### **🔍 Code Review Agent**

- **Expertise**: Security, performance, architecture compliance
- **Responsibilities**: Pull request reviews, quality assurance, vulnerability assessment
- **Rule File**: `.cursor/rules/code-review-agent.mdc`

### **🎨 Frontend Agent**

- **Expertise**: React, Next.js, UI/UX, TailwindCSS
- **Responsibilities**: Component development, styling, user interactions
- **Rule File**: `.cursor/rules/frontend-agent.mdc`

### **⚙️ Backend Agent**

- **Expertise**: API routes, database operations, business logic
- **Responsibilities**: Server-side development, integrations, data management
- **Rule File**: `.cursor/rules/backend-agent.mdc`

### **📋 Task Delegation System**

- **Purpose**: Intelligent task routing to appropriate specialist agents
- **Function**: Analyses requirements and delegates to suitable experts
- **Rule File**: `.cursor/rules/task-delegation-system.mdc`

## 🤖 **LLM Documentation Assistant Prompt**

Use this prompt when working with AI assistants on this project:

---

**CONTEXT**: You are assisting with TJ's Bake & Browse, a Next.js bakery e-commerce platform with specialised AI agents.

**MANDATORY FIRST STEP**: Before answering any question or making any changes, read these documentation files in the `docs/` folder:

1. `todos.md` - Current development priorities
2. `data-models.md` - Database schema and API reference
3. `user-guide.md` - Business operations and features
4. `bugs.md` - Known issues and resolution status
5. `deployment-guide.md` - Technical deployment procedures
6. `enhancements.md` - Future feature roadmap

**AGENT SPECIALISATION**: For complex tasks, delegate to appropriate specialist agents:

- **Frontend changes** → Frontend Agent (`.cursor/rules/frontend-agent.mdc`)
- **Backend changes** → Backend Agent (`.cursor/rules/backend-agent.mdc`)
- **Code reviews** → Code Review Agent (`.cursor/rules/code-review-agent.mdc`)
- **Task coordination** → Task Delegation System (`.cursor/rules/task-delegation-system.mdc`)

**YOUR TASKS**:

1. **Check Documentation First**: Always reference these docs before answering questions about the project
2. **Summarise Current State**: Based on the docs, provide a brief project status summary
3. **Delegate Appropriately**: Route technical tasks to specialist agents for optimal results
4. **Update Documentation**: When making changes, update the relevant documentation files
5. **Maintain Accuracy**: Ensure all code changes align with documented schemas and APIs
6. **Cross-Reference**: Link related information between different documentation files

**PROJECT CONTEXT**:

- **Tech Stack**: Next.js 14, React 18, TypeScript, Supabase, TailwindCSS
- **Current Focus**: UI modernisation, cart persistence, product visibility policy
- **Database**: PostgreSQL with RLS policies, recently overhauled schema
- **Users**: Jersey bakery with admin staff and customers
- **Deployment**: Vercel with Supabase backend

**DOCUMENTATION STANDARDS**:

- Update `todos.md` when progress is made on tasks
- Log any bugs discovered in `bugs.md` with resolution steps
- Update `data-models.md` if database/API changes are made
- Keep `user-guide.md` current with feature changes
- Add new feature ideas to `enhancements.md`

**REMEMBER**: These docs are the single source of truth for the project. Always prioritise documentation accuracy and completeness. Use specialist agents for their areas of expertise.

---

## 🔗 **External Resources**

### **Technical Documentation**

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### **Deployment Platforms**

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

### **Development Tools**

- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vitest Documentation](https://vitest.dev)

## 📞 **Support Contacts**

- **Technical Issues**: Development Team
- **Business Questions**: Product Owner
- **Deployment Support**: DevOps Team
- **Documentation Updates**: Project Maintainer

---

**Last Updated**: Current Date  
**Documentation Version**: 1.0.0  
**Next Review**: Monthly
