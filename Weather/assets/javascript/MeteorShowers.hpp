/*
 * Stellarium: Meteor Showers Plug-in
 * Copyright (C) 2013-2015 Marcos Cardinot
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Suite 500, Boston, MA  02110-1335, USA.
 */
    
#ifndef METEORSHOWERS_HPP_
#define METEORSHOWERS_HPP_

#include "MeteorShower.hpp"
#include "MeteorShowersMgr.hpp"

typedef QSharedPointer<MeteorShower> MeteorShowerP;

class MeteorShowers : public StelObjectModule
{
	Q_OBJECT
	public:
	typedef struct
	{
	QString name;
	QString zhr;
	QString type;
	QDate peak;
} SearchResult;

MeteorShowers(MeteorShowersMgr *mgr);

virtual void init(void) {}

virtual ~MeteorShowers();

virtual void update(double deltaTime);

virtual void draw(StelCore* core);

void loadMeteorShowers(const QVariantMap& map);

QList<SearchResult> searchEvents(QDate dateFrom, QDate dateTo) const;

//
// Methods defined in StelObjectModule class
//
virtual QList<StelObjectP> searchAround(const Vec3d& v, double limitFov, const StelCore* core) const;
virtual StelObjectP searchByNameI18n(const QString& nameI18n) const;
virtual StelObjectP searchByName(const QString& name) const;
virtual StelObjectP searchByID(const QString &id) const;
virtual QStringList listMatchingObjects(const QString& objPrefix, int maxNbItem=5, bool useStartOfWords=false, bool inEnglish=true) const;
virtual QStringList listAllObjects(bool inEnglish) const;
virtual QString getName() const { return "Meteor Showers"; }
virtual QString getStelObjectType() const { return MeteorShower::METEORSHOWER_TYPE; }

private:
	MeteorShowersMgr* m_mgr;
	QList<MeteorShowerP> m_meteorShowers;

	void drawPointer(StelCore* core);
};

#endif /*METEORSHOWERS_HPP_*/
