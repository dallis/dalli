class AddSkladToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :sklad, :boolean
  end

  def self.down
    remove_column :products, :sklad
  end
end
